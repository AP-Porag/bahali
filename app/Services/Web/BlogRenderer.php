<?php

namespace App\Services\Web;

use DOMDocument;
use DOMElement;
use DOMNode;
use Illuminate\Support\Str;

/**
 * Turns an article's Markdown into the reference article template (BlogPages.jsx → ArticlePage):
 *
 *   text before the first "## Heading"  → opening paragraphs (first letter styled as a drop cap)
 *   "## Heading"                         → a numbered section, listed under "In this article"
 *   "### Heading" inside a section       → a step (guide-step)
 *   "> text"                             → bold emergency / important note (article-emergency)
 *   ![alt](image.jpg "caption")          → screenshot with caption, opens full size in a new tab
 *   - lists / 1. lists                   → the article list style (article-signs)
 *
 * Safe by design: raw HTML in the Markdown is stripped and unsafe links (javascript:, data:) are removed.
 */
class BlogRenderer
{
    public function render(string $markdown): array
    {
        $html = Str::markdown($markdown, [
            'html_input'         => 'strip',
            'allow_unsafe_links' => false,
            'max_nesting_level'  => 20,
        ]);

        $doc = new DOMDocument('1.0', 'UTF-8');
        libxml_use_internal_errors(true);
        $doc->loadHTML('<?xml encoding="utf-8"?><div id="bc-root">' . $html . '</div>', LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        libxml_clear_errors();
        $root = $doc->getElementById('bc-root');

        $this->transform($doc, $root);

        $opening = '';
        $sections = [];
        $current = null;
        foreach (iterator_to_array($root->childNodes) as $node) {
            if ($node instanceof DOMElement && $node->tagName === 'h2') {
                if ($current) {
                    $sections[] = $current;
                }
                $current = ['title' => trim($node->textContent), 'nodes' => []];
                continue;
            }
            if ($current) {
                $current['nodes'][] = $node;
            } else {
                $opening .= $doc->saveHTML($node);
            }
        }
        if ($current) {
            $sections[] = $current;
        }

        $sections = array_map(function (array $s, int $i) use ($doc) {
            return ['id' => 'article-section-' . $i, 'title' => $s['title'], 'html' => $this->sectionHtml($doc, $s['nodes'])];
        }, $sections, array_keys($sections));

        $text = trim(preg_replace('/\s+/u', ' ', html_entity_decode(strip_tags(str_replace('>', '> ', $html)), ENT_QUOTES | ENT_HTML5, 'UTF-8')));

        return [
            'opening'  => trim($opening),
            'sections' => $sections,
            'text'     => $text,
            'minutes'  => self::minutes($text),
        ];
    }

    /** Reading time used on cards and articles (reference: words ÷ 180, at least 1). */
    public static function minutes(string $text): int
    {
        $words = $text === '' ? 0 : count(preg_split('/\s+/u', trim($text)));

        return max(1, (int) ceil($words / 180));
    }

    /** Plain text of the Markdown (search and reading time). */
    public function plainText(string $markdown): string
    {
        $html = Str::markdown($markdown, ['html_input' => 'strip', 'allow_unsafe_links' => false]);

        return trim(preg_replace('/\s+/u', ' ', html_entity_decode(strip_tags(str_replace('>', '> ', $html)), ENT_QUOTES | ENT_HTML5, 'UTF-8')));
    }

    private function transform(DOMDocument $doc, DOMElement $root): void
    {
        // > note  →  <strong class="article-emergency">note</strong>
        foreach (iterator_to_array($root->getElementsByTagName('blockquote')) as $quote) {
            $strong = $doc->createElement('strong');
            $strong->setAttribute('class', 'article-emergency');
            $first = true;
            foreach (iterator_to_array($quote->childNodes) as $child) {
                if ($child instanceof DOMElement && $child->tagName === 'p') {
                    if (! $first) {
                        $strong->appendChild($doc->createElement('br'));
                        $strong->appendChild($doc->createElement('br'));
                    }
                    foreach (iterator_to_array($child->childNodes) as $inner) {
                        $strong->appendChild($inner);
                    }
                    $first = false;
                }
            }
            $quote->parentNode->replaceChild($strong, $quote);
        }

        // A paragraph holding only an image → figure (caption from the image title).
        foreach (iterator_to_array($root->getElementsByTagName('img')) as $img) {
            $p = $img->parentNode;
            if (! ($p instanceof DOMElement) || $p->tagName !== 'p' || trim($p->textContent) !== '') {
                $img->setAttribute('loading', 'lazy');
                continue;
            }
            $src = $img->getAttribute('src');
            $caption = $img->getAttribute('title');
            $img->removeAttribute('title');
            $img->setAttribute('loading', 'lazy');

            $figure = $doc->createElement('figure');
            $figure->setAttribute('class', 'article-screenshot');
            $link = $doc->createElement('a');
            $link->setAttribute('href', $src);
            $link->setAttribute('target', '_blank');
            $link->setAttribute('rel', 'noreferrer');
            $link->setAttribute('aria-label', 'View the image at full size, opens in a new tab');
            $link->appendChild($img->cloneNode(true));
            $figure->appendChild($link);
            if ($caption !== '') {
                $figure->appendChild($doc->createElement('figcaption', htmlspecialchars($caption, ENT_QUOTES, 'UTF-8')));
            }
            $p->parentNode->replaceChild($figure, $p);
        }

        foreach (['ul', 'ol'] as $tag) {
            foreach (iterator_to_array($root->getElementsByTagName($tag)) as $list) {
                $list->setAttribute('class', 'article-signs');
            }
        }

        // Links to other websites open in a new tab.
        foreach (iterator_to_array($root->getElementsByTagName('a')) as $a) {
            if (preg_match('#^https?://#i', $a->getAttribute('href')) && ! $a->hasAttribute('target')) {
                $a->setAttribute('target', '_blank');
                $a->setAttribute('rel', 'noreferrer');
            }
        }
    }

    /** Section content; "### Step" headings and what follows them become guide steps. */
    private function sectionHtml(DOMDocument $doc, array $nodes): string
    {
        $hasSteps = (bool) array_filter($nodes, fn (DOMNode $n) => $n instanceof DOMElement && $n->tagName === 'h3');
        if (! $hasSteps) {
            return trim(implode('', array_map(fn ($n) => $doc->saveHTML($n), $nodes)));
        }

        $html = '';
        $step = null;
        foreach ($nodes as $node) {
            if ($node instanceof DOMElement && $node->tagName === 'h3') {
                if ($step) {
                    $html .= $doc->saveHTML($step);
                }
                $step = $doc->createElement('div');
                $step->setAttribute('class', 'guide-step');
                $step->appendChild($node);
                continue;
            }
            if ($step) {
                $step->appendChild($node);
            } else {
                $html .= $doc->saveHTML($node);
            }
        }
        if ($step) {
            $html .= $doc->saveHTML($step);
        }

        return trim($html);
    }
}

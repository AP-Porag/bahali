<?php

namespace Database\Seeders;

use App\Models\BlogPost;
use Illuminate\Database\Seeder;

/**
 * Bahali Connect — the six approved launch articles (Marsha's handoff, 18 November 2026, BlogPages.jsx),
 * converted to the blog's Markdown format. Safe to run again: matches on slug and never overwrites
 * an article that has been edited in the admin panel since.
 *
 *   php artisan db:seed --class=BlogPostSeeder
 */
class BlogPostSeeder extends Seeder
{
    public function run(): void
    {
        foreach (self::ARTICLES as $article) {
            $post = BlogPost::firstOrNew(['slug' => $article['slug']]);
            if ($post->exists && $post->updated_by !== null) {
                continue; // already edited by an administrator
            }
            $post->fill($article)->save();
        }
    }

    private const ARTICLES = [
        [
            'slug' => 'welcome-to-bahali-connect',
            'title' => 'Welcome to Bahali Connect: Why We Created It',
            'category' => 'Taking the first step',
            'reading_paths' => [],
            'summary' => 'Learn why Bahali Connect was created and how it helps Caribbean communities and the diaspora take a first step toward finding support.',
            'body' => 'Welcome to Bahali Connect. Whether you are reading this in Kingston, Port-au-Prince, Port of Spain, New York, Toronto or London, we are glad you are here.

Bahali Connect was created to make mental health and emotional wellness support easier to find across Caribbean communities and the diaspora. It brings provider information into one place so you can explore services and learn about each provider before reaching out.

## Why the first step matters

In my work as a psychologist and clinical social worker, I often hear from people who are ready to talk to a professional but do not know where to start. They wonder whether the person they find will understand their family, their faith, their culture or the way they speak. Sometimes that uncertainty is enough to put the search off for another day, another month or another year.

Some of us grew up hearing that strength meant keeping personal struggles private and carrying on. These messages can make it difficult to speak about what we are experiencing or ask for help. But being strong does not mean you have to carry everything alone.

That first step is what Bahali Connect is here to make easier. Instead of searching with no idea where to begin, you can look for support by topic, location, language and type of service.

The name Bahali means “restore.” That is our hope for everyone who visits: that finding support becomes one part of restoring your peace, your relationships and your sense of self.

## What you will find here

Bahali Connect is a directory of mental health and emotional wellness providers who serve Caribbean communities. You will find a wide range of support, from psychologists, counselors and psychiatrists to pastoral counselors, peer support specialists and parent coaches. A few things to know:

**Searching is always free.** Browse profiles and contact providers directly. Accounts are for providers only. Providers may charge for their services; their fees are separate from using Bahali Connect.

**You can explore at your own pace.** Compare services, review providers’ backgrounds and ask questions before making arrangements. If you are unsure what kind of support you need, a qualified clinical provider can help you understand your options.

Bahali Connect does not provide emergency care. If you or someone else is in immediate danger, contact local emergency services or go to the nearest hospital emergency department. Visit our [Urgent Help](/urgent-help) page for additional support options.

Alongside this post, you will find practical articles to help you search the directory, understand your options and prepare for a first conversation with a provider. More will follow in the weeks ahead.

If you are a provider who serves Caribbean communities, we would love for you to join us. Visit [For Providers](/for-providers) to learn more.

## Support alongside what you value

Seeking professional or community support can sit alongside faith, family and the other sources of strength you value. You do not have to choose between them.

Whether you are exploring support for yourself or helping someone you love, you are welcome here. Seeking support is a sign of strength. You can begin with questions, uncertainty and whatever words you have today.',
            'image' => '/images/connect/support-conversation.jpg',
            'image_alt' => 'Two women in conversation, with one listening attentively.',
            'author_name' => 'Marsha Smith, PsyD, LCSW',
            'author_role' => 'Founder and Executive Director, Bahali Inc.',
            'margin_quote' => 'But being strong does not mean you have to carry everything alone.',
            'cta_label' => NULL,
            'cta_url' => NULL,
            'signoff' => 'With care,',
            'signature' => 'Marsha',
            'published_at' => '2026-11-18 09:00:00',
            'is_featured' => true,
            'on_homepage' => false,
            'status' => 'published',
        ],
        [
            'slug' => 'finding-support-on-bahali-connect',
            'title' => 'Finding Support on Bahali Connect',
            'category' => 'Taking the first step',
            'reading_paths' => [
                'Supporting someone',
            ],
            'summary' => 'Follow three simple steps to explore the directory, learn about providers and reach out when you are ready, with clear guidance along the way.',
            'body' => 'Deciding to look for support can take a lot of courage. Finding it should not take much more.

We built Bahali Connect so that the search itself feels simple. You do not need an account, and searching is always free. In a few minutes, you can see who offers the kind of support you are looking for, read about their experience and decide whom you would like to contact.

## Three simple steps

### 1\\. Search for what matters to you.

Start from [Get Help](/get-help) and choose a topic, such as stress, grief, family relationships or parenting. You can narrow your search by location, by the language you would like to speak and by type of service, from psychologists and mental health counselors to psychiatrists, pastoral counselors and peer support specialists. Not sure which type fits? Our article [Understanding Your Support Options](/blog/understanding-your-support-options) explains each one.

![Search results with location and support-topic controls above language and service-type filters. Jamaica is selected in this example.](/images/connect/blog/blog-search-filters.jpg "Use the filters to explore support that fits your needs. Select the image to view it at full size.")

### 2\\. Take your time with each profile.

Every profile is written by the provider. It describes the support they offer, the languages they speak, whether they offer in-person or virtual appointments and the experience they bring. Read as many as you like. There is no rush, and providers are not notified when you view their profile.

![Fictional community-provider profile showing role, St. Elizabeth location, English language, profile sections, in-person meeting options, fees and a contact area.](/images/connect/blog/blog-illustrative-profile.jpg "Illustrative profile only. All details are fictional; this is not an available provider.")

### 3\\. Reach out when you are ready.

When a provider feels like a good fit, use the Call, Email or Visit website button on their profile. These connect you directly with the provider, who will answer your questions and talk with you about next steps, including fees and availability.

If you are not sure what to ask, our article [Questions to Ask Before a First Meeting](/blog/questions-before-a-first-meeting) offers a short list to help you begin.

## Good to know

-   **Searching is always free.** Accounts are for providers only, so you can search without signing up.
-   **You contact providers directly.** Bahali Connect does not book appointments or send messages for you. Your conversation is between you and the provider.
-   **Providers set their own fees.** Any cost for services is agreed with the provider and is separate from using Bahali Connect.
-   **You choose what feels right.** Bahali Connect helps you see what is available. If you are unsure what kind of support you need, a qualified clinical provider can help you understand your options.

For a fuller walk-through of the site, visit [How it works](/how-it-works).

Bahali Connect does not provide emergency care. If you or someone else is in immediate danger, contact local emergency services or go to the nearest hospital emergency department. Visit our [Urgent Help](/urgent-help) page for additional support options.

## Your first step can be a small one

You do not need to have the right words or a clear plan. You can begin by simply looking, reading a few profiles and noticing who you feel comfortable with. Sometimes that quiet first look is where healing begins.',
            'image' => NULL,
            'image_alt' => NULL,
            'author_name' => 'Marsha Smith, PsyD, LCSW',
            'author_role' => 'Founder and Executive Director, Bahali Inc.',
            'margin_quote' => 'There is no rush.',
            'cta_label' => NULL,
            'cta_url' => NULL,
            'signoff' => 'With care,',
            'signature' => 'Marsha',
            'published_at' => '2026-11-18 09:00:00',
            'is_featured' => false,
            'on_homepage' => false,
            'status' => 'published',
        ],
        [
            'slug' => 'you-do-not-have-to-wait-until-things-feel-unmanageable',
            'title' => 'You Do Not Have to Wait Until Things Feel Unmanageable',
            'category' => 'Taking the first step',
            'reading_paths' => [],
            'summary' => 'Explore what can make reaching out difficult, notice changes in how you feel and consider how support could fit alongside the strengths you already have.',
            'body' => 'Many of us have a quiet rule we follow without ever saying it out loud: we will ask for help when things get bad enough. Until then, we manage. We work, we keep the household going, we show up for everyone else and we tell people we are fine.

The trouble is that “bad enough” keeps moving. The sleepless nights, the short temper, the heaviness that will not lift all become part of normal life. By the time we finally reach out, we may have been carrying much more, for much longer, than anyone needed to.

You do not have to wait for that point. Support can help long before things feel unmanageable.

## Why so many of us wait

There are many reasons people hold off, and most of them make sense.

Some of us were taught that strength means handling things privately. Some worry about what people in their community might say. Some have never seen anyone they know talk openly about their emotional health, so it is hard to imagine doing it themselves. Others face practical barriers, such as cost, time, distance or not knowing where to start.

It is also common to compare our pain with someone else’s and decide ours does not count. *Other people have it worse. I have no right to complain.* But support is not a reward for suffering the most. If something is weighing on you, it matters.

## Gentle signs it may help to talk with someone

There is no test you need to pass before reaching out. Still, it can help to notice when something has shifted. You might consider talking with someone if:

-   You have been feeling low, worried, irritable or numb for several weeks.
-   Your sleep, appetite or energy has changed and is not returning to normal.
-   Things you once enjoyed no longer bring much pleasure.
-   You are pulling away from people you care about, or feel alone even when they are near.
-   Work, school, parenting or daily tasks feel harder than they used to.
-   You are relying more on alcohol or other substances to cope.
-   A loss, a move, a storm, an illness or another major change is still affecting you.
-   Someone close to you has gently said they are worried about you.

Noticing one or two of these does not mean something is wrong with you. It simply means you deserve a space to talk it through.

## Why reaching out earlier helps

In my work as a psychologist and clinical social worker, I have seen how much easier it can be to address a concern while it is still small. Earlier support often means more choices, a gentler pace and less disruption to the rest of your life. It can help you understand what you are feeling, build skills for difficult moments and feel less alone while you do it.

Reaching out early does not have to mean a long commitment. It might be one conversation with a counselor, a few sessions with a psychologist or social worker, or time with a pastoral counselor who can hold both your faith and your feelings. You can start small and decide what feels right as you go. If you are not sure which kind of support would suit you, our article [Understanding Your Support Options](/blog/understanding-your-support-options) explains the differences.

Seeking support can sit alongside faith, family and the other sources of strength you value. It is not a sign that those have failed you. It is one more way of caring for yourself and the people who depend on you.

## If things feel urgent

> If you are thinking about harming yourself or someone else, or if anyone is in immediate danger, please contact local emergency services now or go to the nearest hospital emergency department.

Our [Urgent Help](/urgent-help) page can also help you find free, confidential crisis helplines where you are. Bahali Connect does not provide emergency care.

## You can begin today

You do not need to know exactly what is wrong, and you do not need the perfect words. You can start with “I have not been feeling like myself.” That is enough.

When you are ready, Bahali Connect can help you search for providers by language, location and the kind of support you are looking for.',
            'image' => NULL,
            'image_alt' => NULL,
            'author_name' => 'Marsha Smith, PsyD, LCSW',
            'author_role' => 'Founder and Executive Director, Bahali Inc.',
            'margin_quote' => 'If something is weighing on you, it matters.',
            'cta_label' => NULL,
            'cta_url' => NULL,
            'signoff' => 'With care,',
            'signature' => 'Marsha',
            'published_at' => '2026-11-18 09:00:00',
            'is_featured' => false,
            'on_homepage' => true,
            'status' => 'published',
        ],
        [
            'slug' => 'understanding-your-support-options',
            'title' => 'Understanding Your Support Options',
            'category' => 'Finding your fit',
            'reading_paths' => [
                'Supporting someone',
            ],
            'summary' => 'Learn how different provider roles can support you, understand the difference between clinical and community care and consider where you might feel comfortable beginning.',
            'body' => 'Once you decide to reach out, a new question often follows: who should I talk to? A psychologist? A counselor? A peer support specialist? A pastoral counselor? The titles can be confusing, and it is easy to worry about choosing the wrong one.

The good news is that there is no single right door. Different kinds of support offer different things, and many people use more than one over time. Understanding the differences can help you decide where to begin.

This article explains different provider roles you may encounter as you explore support. Availability on Bahali Connect varies by location and by the providers currently listed. These roles are not interchangeable. Some offer clinical care, which includes assessing and treating mental health concerns. Others offer guidance and support rooted in faith, community or lived experience. Both have value, and knowing which is which helps you find the right fit. To make the list easier to explore, we have grouped the roles into four areas.

## Therapy and psychological care

These providers offer psychological assessment, therapy or support for learning and emotional well-being, depending on their qualifications and role. Many people begin here.

-   **Clinical Psychologists** provide therapy and psychological assessment. Testing can help clarify concerns such as attention difficulties, learning differences or the effects of trauma.
-   **Neuropsychologists** specialize in how the brain affects thinking, memory, attention and behavior. They often assess people after a brain injury or illness, or when changes in memory or learning are a concern.
-   **School Psychologists** support children’s learning, behavior and emotional well-being, often working with families and schools together. Their services depend on their training, practice setting and local requirements.
-   **Clinical Social Workers** provide therapy while paying close attention to the world around you: your family, your work, your community and the practical pressures you face. Many also help people connect with services.
-   **Mental Health Counselors** provide talk therapy for a wide range of emotional and relationship concerns, and help you build practical skills for coping and change.
-   **Marriage and Family Therapists** focus on relationships. They work with couples, families or individuals on communication, conflict and life changes.

If you are not sure where to begin, a qualified clinical provider can help you understand what is going on and suggest next steps.

## Medical and medication care

These providers have medical or advanced nursing training and may prescribe medication where permitted.

-   **Psychiatrists** are medical doctors who diagnose and treat mental health conditions. They can prescribe medication, and some also provide therapy.
-   **Psychiatric Mental Health Nurse Practitioners** are advanced practice nurses who assess mental health concerns and, where permitted, prescribe and manage medication.
-   **Addiction Medicine Specialists** are doctors who treat alcohol and other substance use concerns, including medical care and medication when appropriate.
-   **Developmental-Behavioral Pediatricians** are children’s doctors who specialize in development, learning and behavior, including concerns such as autism, ADHD and developmental delays.

Many people combine medication with therapy. Any decision about medication is made together with a qualified prescriber.

## Specialized support

These providers focus on particular areas of need.

-   **Board Certified Behavior Analysts (BCBAs)** use behavior analysis to help people build skills and address behaviors that make daily life harder. They often work with children and families, including families of children with autism.
-   **Substance Use Counselors** support people who want to change their relationship with alcohol or other substances, through counseling, recovery planning and encouragement.

## Community, peer and faith-based support

These providers offer guidance, encouragement and practical help. The services they offer depend on their training and qualifications. Nonclinical support does not replace an assessment or treatment from a clinical provider when one is needed. Many people use both, and each can strengthen the other.

-   **Pastoral Counselors** bring together emotional care and spiritual guidance. They can be a meaningful choice if you would like to talk through grief, family concerns or life changes in a way that honors your faith. Some also hold a separate clinical license and provide therapy; check the provider’s qualifications and services.
-   **Peer Support Specialists** draw on their own lived experience of mental health or recovery challenges to offer understanding, encouragement and hope.
-   **Community Health Workers** help people find their way through health and social services and connect with local resources.
-   **Parent Coaches** help parents and caregivers build confidence and practical strategies for everyday challenges with their children. Coaching alone does not qualify someone to diagnose or treat a mental health condition.

## A note on titles

Professional titles, training and licensing rules differ from one country to another, and sometimes from one state or province to another. A title used in Jamaica may mean something slightly different in Trinidad and Tobago, Haiti, the United States, Canada or the United Kingdom.

Some providers also list titles not described here. Each profile on Bahali Connect describes the provider’s own background, training and services. Reading the profile, and asking questions when you reach out, helps you understand what a particular provider offers.

## Choosing where to begin

You do not need to have everything figured out before you start browsing. Bahali Connect is open to everyone, and you can explore provider profiles at your own pace. A few questions may help you decide:

-   **What would I most like help with?** A specific concern, a difficult season or a general sense that something is not right.
-   **Do I want my faith to be part of the conversation?** Many clinical providers welcome this, and pastoral counselors build it into their work.
-   **What feels practical?** Language, location, in-person or virtual appointments and fees all matter.

The directory cannot tell you which service you need. If you are unsure, a qualified clinical provider can help you understand your options.

Our article [Questions to Ask Before a First Meeting](/blog/questions-before-a-first-meeting) can also help you prepare.

Bahali Connect does not provide emergency care. If you or someone else is in immediate danger, contact local emergency services or go to the nearest hospital emergency department. Visit our [Urgent Help](/urgent-help) page for additional support options.

## A first conversation can help you find your way

Reaching out is a meaningful step. If the first provider you speak with is not the right fit, that is all right. You can ask for a referral, try someone else or adjust as your needs change.',
            'image' => NULL,
            'image_alt' => NULL,
            'author_name' => 'Marsha Smith, PsyD, LCSW',
            'author_role' => 'Founder and Executive Director, Bahali Inc.',
            'margin_quote' => 'Understanding the differences can help you decide where to begin.',
            'cta_label' => NULL,
            'cta_url' => NULL,
            'signoff' => 'With care,',
            'signature' => 'Marsha',
            'published_at' => '2026-11-18 09:00:00',
            'is_featured' => false,
            'on_homepage' => true,
            'status' => 'published',
        ],
        [
            'slug' => 'questions-before-a-first-meeting',
            'title' => 'Questions to Ask Before a First Meeting',
            'category' => 'Finding your fit',
            'reading_paths' => [],
            'summary' => 'Practical questions about services, experience, fees and privacy can help you feel more comfortable as you prepare for a first conversation with a provider.',
            'body' => 'You have found a provider who seems like a good fit. Now comes the call, the email or the visit to their website, and with it, a familiar flutter of nerves. What do I say? What should I ask? What if I ask the wrong thing?

There is no wrong thing. A first conversation is a chance for you to learn about the provider, just as much as it is a chance for them to learn about you. Asking questions is not rude or demanding. It is a sign that you are taking your well-being seriously.

The questions below work whether you are contacting a psychologist, a counselor, a pastoral counselor, a peer support specialist or any other provider on Bahali Connect. **You do not need to ask every question. Choose the ones that would help you feel more comfortable taking the next step.**

## About the support

-   What kind of support do you offer?
-   What would a first meeting with you involve?
-   How do you usually work with people, and how often would we meet?
-   If I am seeking support for my child or a family member, how would you involve me?
-   What happens if this turns out not to be the right fit for me?

## About your experience

-   What training or qualifications do you have for the support you offer?
-   Have you supported someone with concerns like mine?
-   Have you worked with Caribbean individuals and families, or with people from a background like mine?
-   Are you comfortable including my faith or family in our conversations if I would like to?

## About practical arrangements

-   What are your fees? Do you accept insurance or offer reduced rates?
-   Which languages can we speak together?
-   Do you offer in-person or virtual appointments?
-   When are you available, and how soon could we meet?
-   What should I do if I need help between meetings?

## About privacy

-   How do you handle the information I share with you?
-   Are there situations in which you would need to share information with someone else?
-   If we meet virtually, how do you keep our conversations private?

## A few gentle tips

**Write your questions down.** It is easy to forget what you meant to ask once the conversation begins. A short list on paper or in your phone can help you feel steady.

**Start wherever feels easiest.** If you are nervous, you might simply say, “I found you on Bahali Connect, and I have a few questions before booking.” That is a perfectly good opening.

**Notice how you feel.** The answers matter, but so does the conversation itself. Did you feel listened to? Were your questions welcomed? A good fit often begins with a sense of comfort and respect.

**Give yourself permission to keep looking.** If something does not feel right, you are free to thank the provider and contact someone else. Finding the right support sometimes takes more than one conversation.

Bahali Connect does not provide emergency care. If you or someone else is in immediate danger, contact local emergency services or go to the nearest hospital emergency department. Visit our [Urgent Help](/urgent-help) page for additional support options.

## Your questions are welcome

The right provider will be glad you asked. Your questions help them understand what matters to you, and their answers help you decide with confidence. Bring your curiosity, your concerns and whatever words you have. That is a strong place to begin.',
            'image' => NULL,
            'image_alt' => NULL,
            'author_name' => 'Marsha Smith, PsyD, LCSW',
            'author_role' => 'Founder and Executive Director, Bahali Inc.',
            'margin_quote' => 'Asking questions is not rude or demanding.',
            'cta_label' => NULL,
            'cta_url' => NULL,
            'signoff' => 'With care,',
            'signature' => 'Marsha',
            'published_at' => '2026-11-18 09:00:00',
            'is_featured' => false,
            'on_homepage' => false,
            'status' => 'published',
        ],
        [
            'slug' => 'help-your-community-find-your-work',
            'title' => 'Help Your Community Find Your Work: Join Bahali Connect',
            'category' => 'For Providers',
            'reading_paths' => [],
            'summary' => 'Introduce your services to Caribbean communities and the diaspora through a free provider listing, direct contact options and a shared commitment to making support easier to find.',
            'body' => 'To my colleagues who serve Caribbean communities, at home and across the diaspora: thank you for the work you do.

Over many years in practice, I have seen a quiet gap between the people who are ready for support and the providers who could offer it. Someone in Montego Bay, Miami or Manchester decides it is time to talk to someone. They want a provider who will understand their family, their faith, their language or simply the way they see the world. Many of them never find you, not because you are not there, but because they do not know where to look.

Bahali Connect was created to close that gap. It is a directory that brings Caribbean-serving providers into one place, so the people who need your work can find it more easily. I would love for you to be part of it.

## Who we welcome

Healing happens in many places, and Bahali Connect reflects that. We welcome applications from a wide range of providers, including:

-   **Therapy and psychological care:** clinical psychologists, neuropsychologists, school psychologists, clinical social workers, mental health counselors and marriage and family therapists
-   **Medical and medication care:** psychiatrists, psychiatric mental health nurse practitioners, addiction medicine specialists and developmental-behavioral pediatricians
-   **Specialized support:** board certified behavior analysts and substance use counselors
-   **Community, peer and faith-based support:** pastoral counselors, peer support specialists, community health workers and parent coaches

You may work in a clinic, a school, a church, a community organization or your own practice, and meet people in person or virtually. Providers from all backgrounds are welcome to apply. Eligibility depends on your role, qualifications and the services you offer.

## What your listing offers

**A profile in your own words.** You describe the support you offer, the topics you work with, your background and experience, the languages you speak and whether you offer in-person or virtual appointments. Visitors can read about you before they reach out, so the people who contact you already have a sense of who you are.

**Direct connection.** Visitors contact you through your own phone, email or website. Bahali Connect does not book appointments, send messages or stand between you and the people you serve. You keep your own process for scheduling, fees and intake.

**A free listing.** Applying for and maintaining an approved listing on Bahali Connect is free. We want cost to be no barrier to being found.

**A chance to share your work.** Providers with an approved listing may be considered for a Provider Spotlight, an article that introduces readers to their work. Spotlights are optional and free, and they cannot be purchased. Selection is based on usefulness to readers, clear and current profile information and variety across roles and locations. Credential verification does not influence selection. If you are interested, email [directory@bahali.org](mailto:directory@bahali.org). You can read how features are chosen in our [Provider Spotlight Policy](/provider-spotlight-policy).

**A shared mission.** Every listing helps show Caribbean communities that seeking support is normal, welcome and within reach. Together, we can help reduce the stigma that keeps so many people from asking for help.

## How to join

1.  **Start entering your information.** Your provider account is created as you go. Accounts on Bahali Connect are for providers only.
2.  **Confirm your email address.** We will send a short code to your email. Entering it helps keep Bahali Connect secure and free from spam.
3.  **Complete your profile at your own pace.** Add your professional titles, services, topics, languages, locations and appointment options. We ask for your phone number for our records, and you decide whether it appears on your public profile. You can log back in at any time to finish or update your profile.

Once your listing is approved, it becomes visible to people searching for support.

For eligibility, application details and answers to common questions, please visit our [For Providers](/for-providers) page.

## Be the provider someone is searching for

Somewhere right now, someone is deciding whether to reach out. They may be looking for a person who speaks their language, understands their culture or meets them where they are. Your listing could be how they find you.

I hope you will join us in making support easier to find across our communities.',
            'image' => NULL,
            'image_alt' => NULL,
            'author_name' => 'Marsha Smith, PsyD, LCSW',
            'author_role' => 'Founder and Executive Director, Bahali Inc.',
            'margin_quote' => 'Your listing could be how they find you.',
            'cta_label' => 'Join Bahali Connect',
            'cta_url' => '/provider/directory/create',
            'signoff' => 'With gratitude,',
            'signature' => 'Marsha',
            'published_at' => '2026-11-18 09:00:00',
            'is_featured' => false,
            'on_homepage' => false,
            'status' => 'published',
        ],
    ];
}

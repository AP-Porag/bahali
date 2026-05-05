<?php

namespace App\Utils;

class GlobalConstant
{

    // Status
    public const STATUS_ACTIVE = 1;
    public const STATUS_INACTIVE = 0;

    // Pagination
    public const DEFAULT_PAGINATION = 10;

    // Roles
    public const ROLE_ADMIN = 'admin';
    public const ROLE_USER = 'user';

    // Date formats
    public const DATE_FORMAT = 'Y-m-d';
    public const DATETIME_FORMAT = 'Y-m-d H:i:s';

    // UI
    public const FLASH_SUCCESS = 'success';
    public const FLASH_ERROR = 'error';

    // client type
    public const CLIENT_TYPE_RETAINER = 'retainer';
    public const CLIENT_TYPE_CONTINGENCY = 'contingency';

    // client category
    public const CLIENT_CATEGORY_CLIENT = 'client';
    public const CLIENT_CATEGORY_PROSPECT = 'prospect';
    public const CLIENT_CATEGORY_TARGET_ACCOUNT = 'target_account';

    // fee type
    public const JOB_FEE_TYPE_PERCENTAGE = 'percentage';
    public const JOB_FEE_TYPE_FIXED = 'fixed';
    public const JOB_FEE_TYPE_RETAINED = 'retained';

    //ratings


    //placement invoice status
    public const PLACEMENT_INVOICE_STATUS_NOT_INVOICED = 'not_invoiced';
    public const PLACEMENT_INVOICE_STATUS_INVOICED = 'invoiced';
    public const PLACEMENT_INVOICE_STATUS_PAID = 'paid';

    // invoice status
    public const INVOICE_STATUS_ISSUED = 'issued';
    public const INVOICE_STATUS_PAID = 'paid';
    public const INVOICE_STATUS_CANCELED = 'canceled';


    /*
|--------------------------------------------------------------------------
| Event Types
|--------------------------------------------------------------------------
*/

    // Pipeline
    const EVENT_TYPE_INTERVIEW = 'interview';
    const EVENT_TYPE_OFFER = 'offer';
    const EVENT_TYPE_PLACED = 'placed';
    const EVENT_TYPE_REJECTED = 'rejected';

    // Placement
    const EVENT_TYPE_PLACEMENT_START = 'placement_start';
    const EVENT_TYPE_GUARANTEE_END = 'guarantee_end';

    // Invoice
    const EVENT_TYPE_INVOICE_SENT = 'invoice_sent';
    const EVENT_TYPE_INVOICE_PAID = 'invoice_paid';

    // Agreement
    const EVENT_TYPE_AGREEMENT_SIGNED = 'agreement_signed';

    // Job / Engagement
    const EVENT_TYPE_JOB_CREATED = 'job_created';


    /*
    |--------------------------------------------------------------------------
    | Event Status
    |--------------------------------------------------------------------------
    */

    const EVENT_STATUS_UPCOMING = 'upcoming';
    const EVENT_STATUS_COMPLETED = 'completed';


    /*
    |--------------------------------------------------------------------------
    | Event Entity Types
    |--------------------------------------------------------------------------
    */

    const EVENT_ENTITY_JOB = 'job';
    const EVENT_ENTITY_JOB_CANDIDATE = 'job_candidate';
    const EVENT_ENTITY_PLACEMENT = 'placement';
    const EVENT_ENTITY_INVOICE = 'invoice';
    const EVENT_ENTITY_AGREEMENT = 'agreement';


    /*
    |--------------------------------------------------------------------------
    | Event Colors (HEX)
    |--------------------------------------------------------------------------
    */

    const EVENT_COLOR_INTERVIEW = '#3B82F6'; // blue
    const EVENT_COLOR_PLACEMENT = '#10B981'; // green
    const EVENT_COLOR_INVOICE = '#EF4444';   // red
    const EVENT_COLOR_AGREEMENT = '#8B5CF6'; // purple
    const EVENT_COLOR_REJECTED = '#6B7280';  // gray
    const EVENT_COLOR_JOB = '#F59E0B';       // yellow


    /*
    |--------------------------------------------------------------------------
    | Event Titles
    |--------------------------------------------------------------------------
    */

    const EVENT_TITLE_INTERVIEW = 'Interview Scheduled';
    const EVENT_TITLE_OFFER = 'Offer Made';
    const EVENT_TITLE_PLACED = 'Candidate Placed';
    const EVENT_TITLE_REJECTED = 'Candidate Rejected';

    const EVENT_TITLE_PLACEMENT_START = 'Start Date';
    const EVENT_TITLE_GUARANTEE_END = 'Guarantee Ends';

    const EVENT_TITLE_INVOICE_SENT = 'Invoice Sent';
    const EVENT_TITLE_INVOICE_PAID = 'Invoice Paid';

    const EVENT_TITLE_AGREEMENT_SIGNED = 'Agreement Signed';

    const EVENT_TITLE_JOB_CREATED = 'New Job Created';


    /*
    |--------------------------------------------------------------------------
    | Event Descriptions (Dynamic Templates)
    |--------------------------------------------------------------------------
    */

    const EVENT_DESC_INTERVIEW = '{candidate} scheduled for interview ({job})';
    const EVENT_DESC_OFFER = 'Offer made to {candidate} ({job})';
    const EVENT_DESC_PLACED = '{candidate} placed for {job}';
    const EVENT_DESC_REJECTED = '{candidate} rejected for {job}';

    const EVENT_DESC_PLACEMENT_START = '{candidate} starts {job}';
    const EVENT_DESC_GUARANTEE_END = 'Guarantee ends for {candidate}';

    const EVENT_DESC_INVOICE_SENT = 'Invoice #{invoice} sent (${amount})';
    const EVENT_DESC_INVOICE_PAID = 'Invoice #{invoice} paid (${amount})';

    const EVENT_DESC_AGREEMENT_SIGNED = 'Agreement signed with client #{client}';

    const EVENT_DESC_JOB_CREATED = 'New job opened: {job}';


    /*
    |--------------------------------------------------------------------------
    | NOTIFICATION TYPES
    |--------------------------------------------------------------------------
    */

    const NOTIFICATION_TYPE_INTERVIEW_REMINDER = 'interview_reminder';
    const NOTIFICATION_TYPE_INTERVIEW = 'interview';

    const NOTIFICATION_TYPE_OFFER = 'offer';
    const NOTIFICATION_TYPE_PLACED = 'placed';
    const NOTIFICATION_TYPE_REJECTED = 'rejected';

    const NOTIFICATION_TYPE_PLACEMENT_START = 'placement_start';
    const NOTIFICATION_TYPE_GUARANTEE_END = 'guarantee_end';

    const NOTIFICATION_TYPE_INVOICE_SENT = 'invoice_sent';
    const NOTIFICATION_TYPE_INVOICE_PAID = 'invoice_paid';
    const NOTIFICATION_TYPE_INVOICE_OVERDUE = 'invoice_overdue';

    const NOTIFICATION_TYPE_AGREEMENT_SIGNED = 'agreement_signed';

    const NOTIFICATION_TYPE_JOB_CREATED = 'job_created';

    const NOTIFICATION_TYPE_REVENUE_GOAL_ACHIEVED = 'revenue_goal_achieved';
    const NOTIFICATION_TYPE_REVENUE_GOAL_FAILED = 'revenue_goal_failed';


    /*
    |--------------------------------------------------------------------------
    | NOTIFICATION STATUS
    |--------------------------------------------------------------------------
    */

    const NOTIFICATION_STATUS_UNSEEN = 0;
    const NOTIFICATION_STATUS_SEEN = 1;


    /*
    |--------------------------------------------------------------------------
    | NOTIFICATION ICON LETTERS
    |--------------------------------------------------------------------------
    */

    const NOTIFICATION_ICON_JOB = 'J';
    const NOTIFICATION_ICON_INTERVIEW = 'I';
    const NOTIFICATION_ICON_PLACEMENT = 'P';
    const NOTIFICATION_ICON_INVOICE = '$';
    const NOTIFICATION_ICON_AGREEMENT = 'A';
    const NOTIFICATION_ICON_REVENUE = 'R';
    const NOTIFICATION_ICON_ALERT = '!';


    /*
    |--------------------------------------------------------------------------
    | NOTIFICATION TITLES
    |--------------------------------------------------------------------------
    */

    const NOTIFICATION_TITLE_INTERVIEW_REMINDER = 'Upcoming Interview';
    const NOTIFICATION_TITLE_INTERVIEW = 'Interview Scheduled';

    const NOTIFICATION_TITLE_OFFER = 'Offer Made';
    const NOTIFICATION_TITLE_PLACED = 'Candidate Placed';
    const NOTIFICATION_TITLE_REJECTED = 'Candidate Rejected';

    const NOTIFICATION_TITLE_PLACEMENT_START = 'Start Date';
    const NOTIFICATION_TITLE_GUARANTEE_END = 'Guarantee Ending';

    const NOTIFICATION_TITLE_INVOICE_SENT = 'Invoice Sent';
    const NOTIFICATION_TITLE_INVOICE_PAID = 'Invoice Paid';
    const NOTIFICATION_TITLE_INVOICE_OVERDUE = 'Invoice Overdue';

    const NOTIFICATION_TITLE_AGREEMENT_SIGNED = 'Agreement Signed';

    const NOTIFICATION_TITLE_JOB_CREATED = 'New Job Created';

    const NOTIFICATION_TITLE_REVENUE_GOAL_ACHIEVED = 'Revenue Goal Achieved';
    const NOTIFICATION_TITLE_REVENUE_GOAL_FAILED = 'Revenue Goal Missed';


    /*
    |--------------------------------------------------------------------------
    | NOTIFICATION DESCRIPTIONS (TEMPLATES)
    |--------------------------------------------------------------------------
    */

    const NOTIFICATION_DESC_INTERVIEW_REMINDER = 'Interview for {candidate} ({job}) starts in 1 hour.';
    const NOTIFICATION_DESC_INTERVIEW = '{candidate} scheduled for interview ({job}).';

    const NOTIFICATION_DESC_OFFER = 'Offer made to {candidate} for {job}.';
    const NOTIFICATION_DESC_PLACED = '{candidate} placed successfully in {job}.';
    const NOTIFICATION_DESC_REJECTED = '{candidate} rejected for {job}.';

    const NOTIFICATION_DESC_PLACEMENT_START = '{candidate} starting {job}.';
    const NOTIFICATION_DESC_GUARANTEE_END = 'Guarantee period ending for {candidate}.';

    const NOTIFICATION_DESC_INVOICE_SENT = 'Invoice #{invoice} sent to {client}.';
    const NOTIFICATION_DESC_INVOICE_PAID = 'Invoice #{invoice} has been paid.';
    const NOTIFICATION_DESC_INVOICE_OVERDUE = 'Invoice #{invoice} is overdue.';

    const NOTIFICATION_DESC_AGREEMENT_SIGNED = 'Agreement signed with {client}.';

    const NOTIFICATION_DESC_JOB_CREATED = 'New job created: {job}.';

    const NOTIFICATION_DESC_REVENUE_GOAL_ACHIEVED = 'Revenue goal achieved for {year}.';
    const NOTIFICATION_DESC_REVENUE_GOAL_FAILED = 'Revenue goal missed for {year}.';
}

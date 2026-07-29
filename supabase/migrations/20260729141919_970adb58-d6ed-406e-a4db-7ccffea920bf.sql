update public.promotion_communications
set dispatched_at = sent_at,
    dispatch_ref = 'backfill_pre_slice6'
where dispatched_at is null;
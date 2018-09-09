-- Select all entries from an account id and a user id that
-- Includes pkt_entry_type
SELECT * FROM `pkt_entry`
  LEFT JOIN pkt_entry_type
                  ON pkt_entry_type.entry_type_id = pkt_entry.entry_type_id
                 AND pkt_entry_type.entry_type_account = pkt_entry.entry_account_id
WHERE pkt_entry.entry_account_id = 1 AND pkt_entry.entry_user_id = 1;

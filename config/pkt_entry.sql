CREATE TABLE pkt_entry
(
  entry_id int(11) PRIMARY KEY AUTO_INCREMENT,
  entry_type_id int DEFAULT 0 NOT NULL,
  entry_account_id int DEFAULT 0 NOT NULL,
  entry_project_id int DEFAULT 0 NOT NULL,
  entry_user_id int DEFAULT 0 NOT NULL,
  entry_rate_id int DEFAULT 0 NOT NULL,
  entry_start varchar(25),
  entry_end varchar(25),
  entry_break text COMMENT '[{json object of breaks}]',
  entry_details varchar(1024) DEFAULT '',
  entry_invoice varchar(36)
);
CREATE INDEX entry_account_id_index ON pkt_entry (entry_account_id);
CREATE INDEX entry_user_id_index ON pkt_entry (entry_user_id)
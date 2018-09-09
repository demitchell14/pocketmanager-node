CREATE TABLE pkt_entry_type
(
  entry_type_id int AUTO_INCREMENT,
  entry_type_account int,
  entry_type_name varchar(64) NOT NULL,
  entry_type_desc varchar(512) DEFAULT '',
  CONSTRAINT pkt_entry_type_pk PRIMARY KEY (entry_type_id, entry_type_account)
)

-- Meraj: This Data Definition Language (DDL) is a type of SQL that will be used to parse this document to convert to a table in the browser 
--
-- Database: `Customer Data`
--

-- --------------------------------------------------------

--
-- Table structure for table `Customer_details`
--

CREATE TABLE IF NOT EXISTS `user_details` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
	`CUST_NAME` VARCHAR2(40) NOT NULL, 
	`CUST_CITY` CHAR(35) NOT NULL, 
	`WORKING_AREA` VARCHAR2(35) NOT NULL, 
	`CUST_COUNTRY` VARCHAR2(20) NOT NULL, 
	`GRADE` INTEGER NOT NULL, 
	`OPENING_AMT` NUMBER(12,2) NOT NULL, 
	`RECEIVE_AMT` NUMBER(12,2) NOT NULL, 
	`PAYMENT_AMT` NUMBER(12,2) NOT NULL, 
	`OUTSTANDING_AMT` NUMBER(12,2) NOT NULL, 
	`PHONE_NO` VARCHAR2(17) NOT NULL, 
	`AGENT_CODE` CHAR(6) NOT NULL REFERENCES AGENTS
);  ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=10001 ;

--
-- Dumping data for table `user_details`
--

INSERT INTO `user_details` (`user_id`, `username`, `first_name`, `last_name`, `gender`, `password`, `status`) VALUES
(1, 'rogers63', 'david', 'john', 'Female', 'e6a33eee180b07e563d74fee8c2c66b8', 1),
(2, 'mike28', 'rogers', 'paul', 'Male', '2e7dc6b8a1598f4f75c3eaa47958ee2f', 1),
(3, 'rivera92', 'david', 'john', 'Male', '1c3a8e03f448d211904161a6f5849b68', 1),
(4, 'ross95', 'maria', 'sanders', 'Male', '62f0a68a4179c5cdd997189760cbcf18', 1),
(5, 'paul85', 'morris', 'miller', 'Female', '61bd060b07bddfecccea56a82b850ecf', 1),
(6, 'smith34', 'daniel', 'michael', 'Female', '7055b3d9f5cb2829c26cd7e0e601cde5', 1),
(7, 'james84', 'sanders', 'paul', 'Female', 'b7f72d6eb92b45458020748c8d1a3573', 1),
(8, 'daniel53', 'mark', 'mike', 'Male', '299cbf7171ad1b2967408ed200b4e26c', 1),
(9, 'brooks80', 'morgan', 'maria', 'Female', 'aa736a35dc15934d67c0a999dccff8f6', 1),
(10, 'morgan65', 'paul', 'miller', 'Female', 'a28dca31f5aa5792e1cefd1dfd098569', 1);


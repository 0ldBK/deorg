<?php

if (!defined('MAIN')) die('DB illegal');


class sql_db {
	var $db_connect_id;
	var $query_result;
	var $row = array();
	var $rowset = array();
	var $num_queries = 0;
	var $total_time_db = 0;
	var $time_query = array();
	var $prefix = "";
    var $fprefix = "";

	function sql_db($encoding = 'utf8') {
        $sqlserver = 'localhost';
		$sqlpassword = 'mysqlpassword';
		$sqluser = 'root';
		$database = 'plugin';
		$this->prefix = '';
        $this->fprefix = '';

		$mysql = @mysqli_connect($sqlserver, $sqluser, $sqlpassword, $database);
		if ($mysql->connect_errno) {
		    die("Не удалось подключиться к MySQL: (" . $mysql->connect_errno . ") " . $mysql->connect_error);
		}
		mysqli_query($mysql, 'set names utf8');
		$this->db_connect_id = $mysql;
		return $this->db_connect_id;
	}

	function sql_close() {
		if ($this->db_connect_id) {
			if ($this->query_result) @mysqli_free_result($this->query_result);
			$result = @mysqli_close($this->db_connect_id);
			return $result;
		} else {
			return false;
		}
	}

	function sql_query($query = "", $save = true) {
		unset($this->query_result);
		if ($query != "") {
            $query = str_replace("{prefix}",$this->prefix,$query);
            $query = str_replace("{forum_prefix}",$this->fprefix,$query);
        }
        if($save) {
			$tdba = explode(" ", microtime());
			$tdba = $tdba[1] + $tdba[0];
			$this->query_result = @mysqli_query($this->db_connect_id, $query);
			$tdbe = explode(" ", microtime());
			$tdbe = $tdbe[1] + $tdbe[0];
			$tdbx = $tdba[1] - $tdbe[1];
			$total_tdb = ($tdbe - $tdba);
			$total_tdb = $total_tdb < 0.0001 ? 0.0001 : substr($total_tdb,0,6);

			$this->total_time_db += $total_tdb;
			$this->time_query[] = array(
				"color" => $total_tdb > 0.25 ? ($total_tdb > 0.5 ? "red" : "orange") : "green",
				"time" => $total_tdb,
				"query" => $query
			);
		} else {
			$this->query_result = @mysqli_query($this->db_connect_id, $query);
		}
		if ($this->query_result) {
			$this->num_queries += 1;
			if (isset($this->row->{$this->query_result})) {
                unset($this->row->{$this->query_result});
			}
			if (isset($this->rowset->{$this->query_result})) {
                unset($this->rowset->{$this->query_result});
			}
//			unset($this->row[$this->query_result]);
//			unset($this->rowset[$this->query_result]);
			return $this->query_result;
		} else {
			return false;
		}
	}

	function sql_numrows($query_id = 0) {
		if (!$query_id) $query_id = $this->query_result;
		if ($query_id) {
			return $query_id->num_rows;
		} else {
			return false;
		}
	}

	function sql_affectedrows() {
		if ($this->db_connect_id) {
			$result = @mysqli_affected_rows($this->db_connect_id);
			return $result;
		} else {
			return false;
		}
	}

	function sql_numfields($query_id = 0) {
		if (!$query_id) $query_id = $this->query_result;
		if ($query_id) {
			$result = @mysqli_num_fields($query_id);
			return $result;
		} else {
			return false;
		}
	}

	function sql_fieldname($offset, $query_id = 0) {
		if (!$query_id) $query_id = $this->query_result;
		if ($query_id) {
			$result = @mysqli_field_name($query_id, $offset);
			return $result;
		} else {
			return false;
		}
	}

	function sql_fieldtype($offset, $query_id = 0) {
		if (!$query_id) $query_id = $this->query_result;
		if($query_id) {
			$result = @mysqli_field_type($query_id, $offset);
			return $result;
		} else {
			return false;
		}
	}

	function sql_fetchrow($query_id = 0,$rows_only=false) {
		if (!$query_id) $query_id = $this->query_result;
		if ($query_id) {
			$row = $query_id->fetch_array();

			return $row; //$this->row[$query_id];
		} else {
			return false;
		}
	}

	function sql_fetch_assoc($query_id = 0,$rows_only=false) {
		if (!$query_id) $query_id = $this->query_result;
		if ($query_id) {
			$row = $query_id->fetch_assoc();

			return $row; //$this->row[$query_id];
		} else {
			return false;
		}
	}

	function sql_fetchrowset($query_id = 0,$rows_only=false) {
		if (!$query_id) $query_id = $this->query_result;
		if ($query_id) {
			while ($row = $query_id->fetch_array()) {
				$result[] = $row;
			}
			return $result;
		} else {
			return false;
		}
	}

	function sql_fetchfield($field, $rownum = -1, $query_id = 0) {
		if (!$query_id) $query_id = $this->query_result;
		if ($query_id) {
			if ($rownum > -1) {
				$result = @mysqli_result($query_id, $rownum, $field);
			} else {
				if (empty($this->row[$query_id]) && empty($this->rowset[$query_id])) {
					if ($this->sql_fetchrow()) {
						$result = $this->row[$query_id][$field];
					}
				} else {
					if ($this->rowset[$query_id]) {
						$result = $this->rowset[$query_id][0][$field];
					} else if ($this->row[$query_id]) {
						$result = $this->row[$query_id][$field];
					}
				}
			}
			return $result;
		} else {
			return false;
		}
	}

	function sql_rowseek($rownum, $query_id = 0) {
		if (!$query_id) $query_id = $this->query_result;
		if ($query_id) {
			$result = @mysqli_data_seek($query_id, $rownum);
			return $result;
		} else {
			return false;
		}
	}

	function sql_nextid() {
		if ($this->db_connect_id) {
			$result = @mysqli_insert_id($this->db_connect_id);
			return $result;
		} else {
			return false;
		}
	}

	function sql_freeresult($query_id = 0){
		if (!$query_id) $query_id = $this->query_result;
		if ($query_id) {
			unset($this->row[$query_id]);
			unset($this->rowset[$query_id]);
			@mysqli_free_result($query_id);
			return true;
		} else {
			return false;
		}
	}

	function sql_error($query_id = 0) {
		$result["message"] = @mysqli_error($this->db_connect_id);
		$result["code"] = @mysqli_errno($this->db_connect_id);
		return $result;
	}

	function sql_info($query_id = 0) {
		echo "<ul>";
		foreach($this->time_query as $i => $query) {
			echo "<li style='color: ".$query['color']."; font-size: 10px;'>".$query['time']." [".$query['query']."]</li>";
		}
		echo "</ul>
		<div style='color: navy;font-weight: bold;margin-top: 5px;'>
			Всего запросов к БД - ".count($this->time_query).", общее время запросов: ".$this->total_time_db."
		</div>";

	}
}

$db = new sql_db();
if (!$db->db_connect_id) die("<center>Сервис временно недоступен.</center>");



?>

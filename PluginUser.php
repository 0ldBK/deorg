<?php

/**
 * Created by IntelliJ IDEA.
 * User: zero
 * Date: 27.01.17
 * Time: 0:24
 */

@include "mysql.php";

class PluginUser {
    var $uid;
    var $lastip;
    var $lastuse;
    var $login = '';
    var $level = 0;
    var $access = 3;
    var $clan;
    var $config;
    var $configFile;
    var $configData;
    var $iplists;
    var $bid = '';
    var $vip = 0;
    var $invalid = false;
    var $complete = false;
    var $align;
    private $db;

    public function __construct($UID, $ip) {
        $this->db = new sql_db();
        $this->uid = (int)$UID;
        $this->lastip = $ip;
        $this->configFile = "settings/{$this->uid}.config";

        $this->loadUser();

        $ipList = explode(',', $this->iplists);
        if (!in_array($this->lastip, $ipList, true)) {
            array_push($ipList, $this->lastip);
            $this->iplists = implode(',', $ipList);
        }
    }

    private function loadUser() {
        if (!$this->uid || $this->uid < 600) {
            $this->invalid = true;
            return;
        }
        $query = $this->db->sql_query("SELECT * FROM `vip` WHERE `uid`={$this->uid} LIMIT 1;");
        if ($this->db->sql_numrows($query) < 1) {
            $this->newUser();
        } else {
            foreach ($this->db->sql_fetch_assoc($query) as $key => $value) {
                $this->{$key} = $value;
            }
            $this->complete = true;
        }

        if ($this->complete) {
            $this->blocked();
        }
    }

    public function newUser() {
        $time = time();
        $login= $this->login?:$this->uid;
        $ok = $this->db->sql_query("INSERT INTO `vip` 
              (`uid`, `login`, `lastip`, `firstuse`, `lastuse`, `iplists`, `access`) VALUES 
              ({$this->uid}, '{$login}', '{$this->lastip}', {$time}, {$time}, '{$this->iplists}', {$this->access})");

        return $ok;
    }

    public function updateUser($user) {
        //uid | login | level | clan | align | lastip | firstuse | lastuse | iplists | access | password | vip | silver | bid
        $keys = array('uid', 'login', 'level', 'clan', 'align', 'lastip', 'firstuse',
                'lastuse', 'iplists', 'access', 'password', 'vip', 'silver', 'bid');

        $map = (object)array(
            'klan' => 'clan'
        );

        $set = array();
        if (!empty($user->iplists)) {
            $set[] = "`iplists`='{$user->iplists}'";
        }

        if (!isset($user->lastuse)) {
            $set[] = "`lastuse`=" . time();
        }

        foreach ($user as $key => $value) {
            $key = isset($map->{$key}) ? $map->{$key} : $key;
            if (array_search($key, $keys) == null) {
                continue;
            }
            $set[] = "`{$key}`='" . mysqli_escape_string($this->db->db_connect_id, $value) . "'";
        }

        $ok = $this->db->sql_query("UPDATE `vip` SET " . implode(", ", $set) . " WHERE `uid`={$this->uid}");

        if ($this->login != $this->uid && !empty($this->login)) {
            $this->complete = true;
        }

        return $ok;
    }

    public function block() {
        $this->access = 3;
        $this->updateUser((object)[
            'access' => 3
        ]);
    }

    public function blocked() {
        if (!$this->complete) {
            return false;
        }

        if ($this->vip < time()) {
            $this->block();
        }

        return $this->access == 3;
    }

    public function getConfig() {
        if ($this->config) {
            return $this->config;
        }

        if (file_exists($this->configFile)) {
            $this->configData = file_get_contents($this->configFile);
            $this->config = json_decode($this->configData);
        }
        if (!is_object($this->config)) {
            $this->resetConfig();
        }

        return $this->config;
    }

    public function setConfig($config) {
        if (gettype($config) === 'string' && strlen($config) > 100) {
            $tmpConfig = json_decode($config);
            if (is_object($tmpConfig)) {
                $this->config = $tmpConfig;
                $this->configData = $config;
            }
        } else if (is_object($config)) {
            $this->config = $config;
            $this->configData = json_encode($config);
        }
    }

    public function saveConfig() {
        $config = $this->config;
        if (!is_object($config) || !is_numeric($config->saved)) {
            return "[{$this->uid}] Ошибка в настройках! Без паники, попробуйте ещё раз.";
        }
        if ($config->saved <= 0 || $config->saved < filemtime($this->configFile)) {
            return "[{$this->uid}] Настройки на сервере новее/идентичны вашим. Проверьте дату на компьютере.";
        }

        if (file_put_contents($this->configFile, $this->configData)) {
            return "[{$this->uid}] Настройки сохранены";
        } else {
            return "[{$this->uid}] Сохранение не удалось :(";
        }
    }

    public function resetConfig() {
        $this->configData = file_get_contents("settings/default.config");
        $this->config = json_decode($this->configData);
        return $this->saveConfig();
    }
}

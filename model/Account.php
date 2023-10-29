<?php


class Account {

  private $id;
  private $name;
  private $currency;
  private $description;
  private $balance;



  
  public function __construct() {
    
    if(func_num_args() == 4){
      //asumiendo orden name, curr, desc, balance
      $params = func_get_args();
      $this->setName($params[0]);
      $this->setCurrency($params[1]);
      $this->setDescription($params[2]);
      $this->setBalance($params[3]);
    }else if (func_num_args() == 5){
      //asumiendo orden id, name, curr, desc, balance
      $this->setId($params[0]);
      $this->setName($params[1]);
      $this->setCurrency($params[2]);
      $this->setDescription($params[3]);
      $this->setBalance($params[4]);
    }


  }


    // Getter para $id
    public function getId() {
      return $this->id;
  }

  // Setter para $id
  public function setId($id) {
      $this->id = $id;
  }

  // Getter para $name
  public function getName() {
      return $this->name;
  }

  // Setter para $name
  public function setName($name) {
      $this->name = $name;
  }

  // Getter para $currency
  public function getCurrency() {
      return $this->currency;
  }

  // Setter para $currency
  public function setCurrency($currency) {
      $this->currency = $currency;
  }

  // Getter para $description
  public function getDescription() {
      return $this->description;
  }

  // Setter para $description
  public function setDescription($description) {
      $this->description = $description;
  }

  // Getter para $balance
  public function getBalance() {
      return $this->balance;
  }

  // Setter para $balance
  public function setBalance($balance) {
      $this->balance = $balance;
  }


}
<?php

class Reg
{

	private $id;
	private $type;
	private $date;
	private $amount;
	private $category;
	private $accFrom; // id 
	private $accTo; // id

	


	/* #region getters y setters */
	// Getter para el atributo $id
	public function getId()
	{
		return $this->id;
	}

	// Setter para el atributo $id
	public function setId($id)
	{
		$this->id = $id;
	}

	// Getter para el atributo $type
	public function getType()
	{
		return $this->type;
	}

	// Setter para el atributo $type
	public function setType($type)
	{
		$this->type = $type;
	}

	// Getter para el atributo $date
	public function getDate()
	{
		return $this->date;
	}

	// Setter para el atributo $date
	public function setDate($date)
	{
		$this->date = $date;
	}

	// Getter para el atributo $amount
	public function getAmount()
	{
		return $this->amount;
	}

	// Setter para el atributo $amount
	public function setAmount($amount)
	{
		$this->amount = $amount;
	}

	// Getter para el atributo $category
	public function getCategory()
	{
		return $this->category;
	}

	// Setter para el atributo $category
	public function setCategory($category)
	{
		$this->category = $category;
	}

	// Getter para el atributo $accFrom
	public function getAccFrom()
	{
		return $this->accFrom;
	}

	// Setter para el atributo $accFrom
	public function setAccFrom($accFrom)
	{
		$this->accFrom = $accFrom;
	}
	

	/**
	 * Get the value of accTo
	 */
	public function getAccTo()
	{
		return $this->accTo;
	}

	/**
	 * Set the value of accTo
	 */
	public function setAccTo($accTo)
	{
		$this->accTo = $accTo;
	}

	/* #endregion */
}

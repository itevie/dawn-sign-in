package models

type Token struct {
	Token string `db:"token" json:"token"`
	User  int    `db:"user" json:"user"`
	Scope string `db:"scope" json:"scope"`
}

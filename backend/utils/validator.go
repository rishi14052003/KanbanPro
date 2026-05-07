package utils

import (
	"regexp"
	"unicode"
)

// Email regex pattern - standard email validation
var emailRegex = regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`)

// ValidateEmail checks if the email format is valid
func ValidateEmail(email string) bool {
	return emailRegex.MatchString(email)
}

// ValidatePassword checks if the password meets security requirements:
// - At least 8 characters
// - At least 1 uppercase letter
// - At least 1 lowercase letter
// - At least 1 number or special character
func ValidatePassword(password string) bool {
	if len(password) < 8 {
		return false
	}

	var (
		hasUpper   bool
		hasLower   bool
		hasNumber  bool
		hasSpecial bool
	)

	for _, char := range password {
		switch {
		case unicode.IsUpper(char):
			hasUpper = true
		case unicode.IsLower(char):
			hasLower = true
		case unicode.IsNumber(char):
			hasNumber = true
		case unicode.IsPunct(char) || unicode.IsSymbol(char):
			hasSpecial = true
		}
	}

	return hasUpper && hasLower && (hasNumber || hasSpecial)
}

// GetPasswordRequirements returns a list of password requirements and which are met
func GetPasswordRequirements(password string) []struct {
	Text string
	Met  bool
} {
	reqs := []struct {
		Text string
		Met  bool
	}{
		{"At least 8 characters", len(password) >= 8},
		{"Uppercase letter", hasUpper(password)},
		{"Lowercase letter", hasLower(password)},
		{"Number or special character", hasNumberOrSpecial(password)},
	}
	return reqs
}

func hasUpper(password string) bool {
	for _, char := range password {
		if unicode.IsUpper(char) {
			return true
		}
	}
	return false
}

func hasLower(password string) bool {
	for _, char := range password {
		if unicode.IsLower(char) {
			return true
		}
	}
	return false
}

func hasNumberOrSpecial(password string) bool {
	for _, char := range password {
		if unicode.IsNumber(char) || unicode.IsPunct(char) || unicode.IsSymbol(char) {
			return true
		}
	}
	return false
}

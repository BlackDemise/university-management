package org.endipi.auth.util;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Component
public class PasswordUtil {

    private static final String UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
    private static final String DIGITS = "0123456789";
    private static final String SPECIALS = "!@#$%^&*()-_=+[]{}|;:,.<>?";
    private static final String ALL_ALLOWED = UPPERCASE + LOWERCASE + DIGITS + SPECIALS;

    private static final SecureRandom RANDOM = new SecureRandom();

    public String generateRawPassword() {
        List<Character> chars = new ArrayList<>();

        chars.add(randomChar(UPPERCASE));
        chars.add(randomChar(LOWERCASE));
        chars.add(randomChar(DIGITS));
        chars.add(randomChar(SPECIALS));

        for (int i = 0; i < 4; i++) {
            chars.add(randomChar(ALL_ALLOWED));
        }

        Collections.shuffle(chars);
        StringBuilder password = new StringBuilder();
        for (char c : chars) {
            password.append(c);
        }

        return password.toString();
    }

    public String hashPassword(String rawPassword, PasswordEncoder encoder) {
        return encoder.encode(rawPassword);
    }

    private static char randomChar(String chars) {
        return chars.charAt(RANDOM.nextInt(chars.length()));
    }
}

package org.endipi.user.service.impl;

import lombok.RequiredArgsConstructor;
import org.endipi.user.service.EmailService;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {
    // Please run the 'config-server' first. It will autowire this dude.
    private final JavaMailSender javaMailSender;

    @Override
    public void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("anhsohackervl@gmail.com");
        message.setTo(to);
        message.setText(body);
        message.setSubject(subject);
        javaMailSender.send(message);
        System.out.println("Mail was sent successfully!");
    }
}

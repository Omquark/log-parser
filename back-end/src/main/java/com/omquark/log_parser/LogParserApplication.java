package com.omquark.log_parser;

import com.omquark.log_parser.service.LogParser;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.File;
import java.io.FileReader;
import java.nio.CharBuffer;
import java.util.Scanner;

@SpringBootApplication
public class LogParserApplication {

    public static void main(String[] args) {
        SpringApplication.run(LogParserApplication.class, args);

        String log = "";

        try {
            FileReader logFile = new FileReader("test.json");
            StringBuilder input = new StringBuilder();
            CharBuffer buffer = CharBuffer.allocate(1000);
            while (logFile.read(buffer) > 0) {
                System.out.println(buffer.position());
                buffer.position(0);
                input.append(buffer);
            }

            log = input.toString().toLowerCase();
        } catch (Exception e) {
            e.printStackTrace();
        }
        String parsedLog = LogParser.parse(log, "SNES");
        System.out.println(parsedLog);
    }
}
package com.omquark.log_parser;

import com.omquark.log_parser.service.LogParser;
import com.omquark.log_parser.service.OpCodesService;
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
        OpCodesService.init("..\\opcodes.json");
    }
}
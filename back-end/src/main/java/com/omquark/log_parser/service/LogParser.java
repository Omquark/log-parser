package com.omquark.log_parser.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Stream;

public class LogParser {

    private LogParser() {
    }

    @Getter
    @Setter
    @NoArgsConstructor
    private static class Cpu65816 {
        private int a;
        private int x;
        private int y;
        private int p;
        private int d;
        private int s;
        private int pc;
    }

    /**
     * Parses log files into a string when received from the logger.
     *
     * @param logFile The log string to parse. It's is expected in a JSON format whose object looks as
     *                {
     *                "pc counter": {
     *                "register": "value"...
     *                }, ...
     *                }
     * @return A refined log of the values in hexadecimal, used for tracking to determine when reads/writes
     * occur. Specifically designed to be used in documenting and decompiling sections of code from a ROM.
     */
    public static String parse(String logFile, String cpuType) {
        ObjectMapper objectMapper = new ObjectMapper();
        List<Cpu65816> cpuList = null;
        try {
            cpuList = objectMapper.readValue(logFile, new TypeReference<>() {
            });

            cpuList.sort(Comparator.comparingInt(a -> a.pc));
        } catch (Exception e) {
            e.printStackTrace();
        }

        if (cpuList != null) {
            cpuList.forEach((cpu) -> System.out.println(cpu.pc));
        }

        return "";
    }
}

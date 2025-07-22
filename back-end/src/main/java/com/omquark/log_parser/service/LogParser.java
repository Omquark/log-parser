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
     * @param logFile The log string to parse. It's expected in a JSON format whose object looks as
     *                {
     *                  "register": "value"...
     *                  "register": "value"...
     *                }
     *                registers are any register within the SNES, specifically the A, X, Y, PC, S, D, and P registers
     * @return A refined log of the values in hexadecimal, used for tracking to determine when reads/writes
     * occur. Specifically designed to be used in documenting and decompiling sections of code from a ROM.
     */
    public static String parse(String logFile, String cpuType) {
        ObjectMapper objectMapper = new ObjectMapper();
        List<Cpu65816> cpuList = null;
        String result = "";

        try {
            cpuList = objectMapper.readValue(logFile, new TypeReference<>() {
            });
            cpuList.sort(Comparator.comparingInt(a -> a.pc));
            result = objectMapper.writeValueAsString(cpuList);
            System.out.println("logFile" + logFile);
            System.out.println("result" + result);
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\":\"FAIL\"}";
        }

//        cpuList.forEach((cpu) -> System.out.println(cpu.pc));

        return result;
    }
}

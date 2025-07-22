package com.omquark.log_parser.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.omquark.log_parser.dao.OpCode;
import lombok.Getter;
import org.springframework.stereotype.Service;

import java.io.FileReader;
import java.nio.CharBuffer;
import java.util.HashMap;
import java.util.List;

@Getter
@Service
public class OpCodesService {
    private static HashMap<String, OpCode> opCodes = new HashMap<>(256);
    private static boolean isInit = false;

    private OpCodesService() {
    }

    public static void init(String filePath) {

        if(isInit) return;

        StringBuilder builder = new StringBuilder();
        CharBuffer buffer = CharBuffer.allocate(1000);
        String rawOpCodes = "";
        ObjectMapper mapper = new ObjectMapper();
        List<OpCode> tempCodes;

        try (FileReader fr = new FileReader(filePath)) {
            while (fr.read(buffer) > 0) {
                buffer.position(0);
                builder.append(buffer);
            }
            rawOpCodes = builder.toString();
        } catch (Exception e) {
            return;
        }

        try {
            tempCodes = mapper.readValue(rawOpCodes, new TypeReference<>() {
            });
            tempCodes.forEach((opcode) -> opCodes.put(opcode.getValue(), opcode));
        } catch (Exception e) {
            e.printStackTrace();
            return;
        }

        isInit = true;
    }
}

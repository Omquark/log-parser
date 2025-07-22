package com.omquark.log_parser.controller;

import com.omquark.log_parser.service.LogParser;
import com.omquark.log_parser.service.OpCodesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class OpCodeController {
    @Autowired
    OpCodesService opCodesService;

    @CrossOrigin
    @PostMapping(value = "/ops/disassemble", consumes = "application/json")
    @ResponseBody
    public ResponseEntity<String> disassemble(@RequestBody String log) {
        StringBuilder body = new StringBuilder();
        String parsedLog = LogParser.parse(log, "SNES");
        System.out.print(parsedLog);
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(parsedLog);
    }
}

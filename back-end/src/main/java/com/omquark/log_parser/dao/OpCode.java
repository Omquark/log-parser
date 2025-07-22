package com.omquark.log_parser.dao;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OpCode {
    private String value;
    private String mnemonic;
    private int bytes;
    private String[] flagsRead;
    private String[] flagsWritten;
    private String fullName;
    private String effectedBy;
    private String addressingMode;

    private OpCode() {
    }
}

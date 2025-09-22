package com.authentication.server.module.request;

import lombok.Data;

@Data
public class ValidateRequest {
  private int code;
  private String email;
}

package com.authentication.server.module.model;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Token {

  private Long id;
  private User user;
  private String token;
  private String secret;
  private boolean scanned = false;

  public void scanned() {
    this.scanned = true;
  }

  @Data
  public static class TokenValidity {
    private Boolean valid  = false;
    private String message = "Invalid token";
  }

}

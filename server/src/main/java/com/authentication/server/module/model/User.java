package com.authentication.server.module.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User {
  private Long id;
  private String email;

  public User(String email) {
    this.email = email;
  }
}

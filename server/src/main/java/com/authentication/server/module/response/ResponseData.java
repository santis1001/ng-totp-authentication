package com.authentication.server.module.response;

import lombok.*;
import lombok.experimental.SuperBuilder;

import java.io.Serial;
import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class ResponseData<T> implements Serializable {
  @Serial
  private static final long serialVersionUID = 1L;

  private Boolean success;
  private T data;
  private ResponseError error;

  @Getter
  @Setter
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class ResponseError implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;
    private String code;
    private String message;
  }

  public static <T> ResponseData<T> ok(T data) {
    return ResponseData.<T>builder()
        .success(true)
        .data(data)
        .error(null)
        .build();
  }

  public static <T> ResponseData<T> error(String code, String message) {
    return ResponseData.<T>builder()
        .success(false)
        .data(null)
        .error(ResponseError.builder()
            .code(code)
            .message(message)
            .build())
        .build();
  }

  public static <T> ResponseData<T> error(ValidationException ex) {
    return error(ex.getCode(), ex.getMessage());
  }


  @Getter
  public static class ValidationException extends RuntimeException {

    @Serial
    private static final long serialVersionUID = 1L;

    private String code = "????";
    private String message;

    public ValidationException(String code, String message) {
      super(message);
      this.code = code;
      this.message = message;
    }
    public ValidationException(String message) {
      super(message);
    }

  }
}

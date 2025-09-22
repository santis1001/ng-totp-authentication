package com.authentication.server.module;

import com.authentication.server.module.request.UserRegistrationRequest;
import com.authentication.server.module.request.ValidateRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;


@RestController
@RequestMapping("/api/v1/totp")
public class TotpController {


  private final TotpService totpService;

  public TotpController(TotpService totpService) {
    this.totpService = totpService;
  }

  @PostMapping("/register")
  public ResponseEntity<?> register(@RequestBody UserRegistrationRequest user) {

    return ResponseEntity.ok(totpService.registerUser(user.getEmail()));
  }

  @GetMapping(value="/image/{token}.png", produces = "image/png")
  public byte[] getImage(@PathVariable() String token) {
    return totpService.getRedirectQr(token);
  }

  @GetMapping("/scan/{token}")
  public RedirectView redirectView(@PathVariable() String token) {
    return new RedirectView(totpService.redirectToAuthenticator(token));
  }

  @GetMapping("/ping/{token}")
  public ResponseEntity<?> ping(@PathVariable() String token) {

    return ResponseEntity.ok(totpService.checkScannedStatus(token));
  }

  @PostMapping("/validate")
  public ResponseEntity<?> validate(@RequestBody ValidateRequest validateRequest) {
    return ResponseEntity.ok(totpService.getTokenValidity(validateRequest.getEmail(), validateRequest.getCode()));
  }

}

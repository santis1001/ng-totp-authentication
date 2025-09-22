package com.authentication.server.module;

import com.authentication.server.module.model.Token;
import com.authentication.server.module.model.User;
import com.authentication.server.module.response.ResponseData;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorConfig;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import com.warrenstrange.googleauth.GoogleAuthenticatorQRGenerator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

@Service
public class TotpService {

  private final TotpRepository totpRepository;
  private final TotpRepository.UserStore userRepository;
  private final TotpRepository.TokenStore tokenRepository;

  @Value("${server.app.address}")
  private String ADDRESS;

  @Value("${server.app.issuer}")
  private String ISSUER;

  public TotpService(TotpRepository totpRepository) {
    this.totpRepository = totpRepository;
    this.userRepository = this.totpRepository.UserRepository();
    this.tokenRepository = this.totpRepository.TokenRepository();

  }

  public ResponseData<?> registerUser(String email) {

    User user = userRepository.addUser(email);

    Token token = new Token();
    token.setUser(user);
    token.setToken(UUID.randomUUID().toString());
    token.setSecret(this.generateSecret());

    tokenRepository.addToken(token);
    return ResponseData.ok(token.getToken());
  }

  public byte[] getRedirectQr(String tokenString){

    Token token = this.tokenRepository.getTokenByToken(tokenString);

    String url = this.ADDRESS;
    url = url.replace("{1}", token.getToken());

    return generateQRImage(url);
  }

  public ResponseData<?> checkScannedStatus(String tokenString){
    Token token = this.tokenRepository.getTokenByToken(tokenString);
    Token.TokenValidity tokenValidity = new Token.TokenValidity();
    if(token.isScanned()){
      tokenValidity.setValid(true);
      tokenValidity.setMessage("Se ha escaneado el código");
    } else {
      tokenValidity.setValid(false);
      tokenValidity.setMessage("El código aun no se registra");
    }

    return ResponseData.ok(tokenValidity);
  }

  public String redirectToAuthenticator(String tokenString){
    Token token = this.tokenRepository.getTokenByToken(tokenString);
    token.scanned();
    this.tokenRepository.setToken(token);
    String username = token.getUser().getEmail();
    String secret = token.getSecret();

    String totpUrl =generateTOTPUrl(secret, username);

    return totpUrl;
  }

  public ResponseData<?> getTokenValidity(String email, int code){
    User user = this.userRepository.findByEmail(email);
    if(Objects.isNull(user)) return ResponseData.error("400", "No se encontró el usuario");
    Token token = this.tokenRepository.getTokenByUser(user.getId());

    Token.TokenValidity tokenValidity = new Token.TokenValidity();
    if(isValid(token.getSecret(),  code)){
      tokenValidity.setValid(true);
      tokenValidity.setMessage("El código es valido");
    }

    return ResponseData.ok(tokenValidity);
  }

  private String generateSecret() {
    GoogleAuthenticator gAuth = new GoogleAuthenticator();
    final GoogleAuthenticatorKey key = gAuth.createCredentials();
    return key.getKey();
  }

  private String generateTOTPUrl(String secret, String username) {
    try {
      return GoogleAuthenticatorQRGenerator.getOtpAuthTotpURL(
        ISSUER,
        username,
        new GoogleAuthenticatorKey.Builder(secret).build());
    } catch (Exception e) {
      return null;
    }
  }

  private static byte[] generateQRImage(String qrCodeUrl) {
    try {
      QRCodeWriter qrCodeWriter = new QRCodeWriter();
      Map<EncodeHintType, Object> hintMap = new HashMap<>();
      hintMap.put(EncodeHintType.CHARACTER_SET, "UTF-8");

      BitMatrix bitMatrix = qrCodeWriter.encode(qrCodeUrl, BarcodeFormat.QR_CODE, 200, 200, hintMap);
      BufferedImage bufferedImage = MatrixToImageWriter.toBufferedImage(bitMatrix);

      ByteArrayOutputStream baos = new ByteArrayOutputStream();
      ImageIO.write(bufferedImage, "png", baos);
      return baos.toByteArray();
    } catch (WriterException | IOException e) {
      return null;
    }
  }


  private boolean isValid(String secret, int code) {
    GoogleAuthenticator gAuth = new GoogleAuthenticator(
        new GoogleAuthenticatorConfig.GoogleAuthenticatorConfigBuilder().build()
    );
    return gAuth.authorize(secret, code);
  }

}

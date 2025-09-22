package com.authentication.server.module;

import com.authentication.server.module.model.Token;
import com.authentication.server.module.model.User;
import org.springframework.stereotype.Repository;

import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class TotpRepository {

  private UserStore userStore = new UserStore();
  private TokenStore tokenStore = new TokenStore();

  public UserStore UserRepository() {
    return userStore;
  }
  public TokenStore TokenRepository() {
    return tokenStore;
  }

  public static class UserStore {

    private final Map<Long, User> Users = new ConcurrentHashMap<>();
    private final AtomicLong idCounter = new AtomicLong(1);

    public User getUser(long id) {
      return Users.get(id);
    }

    private Long saveUser(User user) {
      if (Objects.isNull(user.getId())) {
        long id = idCounter.getAndIncrement();
        user.setId(id);
      }

      Users.put(user.getId(), user);

      return user.getId();
    }

    public void setUserEmail(long id, String email) {
      User user = new User(id, email);
      this.saveUser(user);
    }

    public User addUser(String email) {
      User user = new User(email);
      return this.getUser(this.saveUser(user));
    }
    public User findByEmail(String email) {
      return Users.values().stream()
          .filter(u -> u.getEmail().equalsIgnoreCase(email))
          .findFirst()
          .orElse(null); // or throw exception if not found
    }
  }

  public static class TokenStore {
    private final Map<Long, Token> Tokens = new ConcurrentHashMap<>();
    private final Map<Long, Long> UserToken = new ConcurrentHashMap<>();
    private final Map<String, Long> TokenByToken = new ConcurrentHashMap<>();
    private final AtomicLong idCounter = new AtomicLong(1);

    public Token getToken(long id) {
      return Tokens.get(id);
    }

    public Token getTokenByUser(long userId) {
      Long id = UserToken.get(userId);
      if (Objects.isNull(id)) {
        return null;
      }
      return Tokens.get(id);
    }

    public Token getTokenByToken(String token) {
      Long id = TokenByToken.get(token);
      if (Objects.isNull(id)) {
        return null;
      }
      return Tokens.get(id);
    }

    private Long saveToken(Token token) {
      if (Objects.isNull(token.getId())) {
        Long id = idCounter.getAndIncrement();
        token.setId(id);
      }
      Tokens.put(token.getId(), token);
      UserToken.put(token.getUser().getId(), token.getId());
      TokenByToken.put(token.getToken(), token.getId());

      return token.getId();
    }

    public void setToken(Token token) {
      saveToken(token);
    }

    public Long addToken(Token token) {
      return saveToken(token);
    }
  }
}

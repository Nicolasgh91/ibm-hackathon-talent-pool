package com.talentpool.tools;

import com.talentpool.infrastructure.security.PasswordHasher;

public final class PasswordHashCli {

  private PasswordHashCli() {}

  public static void main(String[] args) {
    String password = args.length > 0 ? args[0] : "Demo123!";
    PasswordHasher hasher = new PasswordHasher(3, 65536, 4);
    System.out.println(hasher.hash(password));
  }
}


package com.talentpool.api.exception;

import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;

/** Exception thrown when an invitation is invalid, expired, or already used. */
public class InvalidInvitationException extends WebApplicationException {

  public InvalidInvitationException(String reason) {
    super("Invalid invitation: " + reason, Response.Status.BAD_REQUEST);
  }

  public static InvalidInvitationException expired() {
    return new InvalidInvitationException("invitation has expired");
  }

  public static InvalidInvitationException alreadyUsed() {
    return new InvalidInvitationException("invitation has already been used");
  }

  public static InvalidInvitationException notFound() {
    return new InvalidInvitationException("invitation not found");
  }

  public static InvalidInvitationException maxAttemptsReached() {
    return new InvalidInvitationException("maximum attempts reached");
  }
}

// Made with Bob

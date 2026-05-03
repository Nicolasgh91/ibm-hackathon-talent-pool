package com.talentpool.api.exception;

import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;

/** Exception thrown when a user attempts to access a resource they don't have permission for. */
public class UnauthorizedAccessException extends WebApplicationException {

  public UnauthorizedAccessException(String message) {
    super(message, Response.Status.FORBIDDEN);
  }

  public UnauthorizedAccessException(String resourceType, Object id) {
    super(String.format("Access denied to %s: %s", resourceType, id), Response.Status.FORBIDDEN);
  }
}

// Made with Bob

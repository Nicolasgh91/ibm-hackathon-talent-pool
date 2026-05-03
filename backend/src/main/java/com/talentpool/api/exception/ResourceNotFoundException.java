package com.talentpool.api.exception;

import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;

/** Exception thrown when a requested resource is not found. */
public class ResourceNotFoundException extends WebApplicationException {

  public ResourceNotFoundException(String resourceType, Object id) {
    super(String.format("%s not found: %s", resourceType, id), Response.Status.NOT_FOUND);
  }

  public ResourceNotFoundException(String message) {
    super(message, Response.Status.NOT_FOUND);
  }
}

// Made with Bob

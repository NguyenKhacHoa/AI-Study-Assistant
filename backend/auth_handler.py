from fastapi import Header, HTTPException, status
from db import supabase

def get_current_user(authorization: str = Header(...)) -> str:
    """
    Dependency to extract and verify the JWT token from the Authorization header.
    Returns the authenticated user's ID.
    """
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Authorization header format. Must start with 'Bearer '"
        )
    
    token = authorization.split(" ")[1]
    
    try:
        # Verify JWT token using Supabase Client
        user_response = supabase.auth.get_user(token)
        if not user_response or not user_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or session expired"
            )
        return user_response.user.id
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired authentication token: {str(e)}"
        )

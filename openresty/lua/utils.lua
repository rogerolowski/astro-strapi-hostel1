-- Lua utilities for Hostel Management System
-- This file contains common utility functions for OpenResty

local _M = {}

-- JWT validation utility (basic example)
function _M.validate_jwt(token)
    if not token then
        return false, "No token provided"
    end
    
    -- Basic token validation (you'd implement proper JWT validation here)
    if string.len(token) < 10 then
        return false, "Invalid token format"
    end
    
    return true, "Valid token"
end

-- Rate limiting with Redis (if Redis is available)
function _M.check_rate_limit(key, limit, window)
    local redis = require "resty.redis"
    local red = redis:new()
    
    -- Connect to Redis (adjust connection details as needed)
    local ok, err = red:connect("redis", 6379)
    if not ok then
        ngx.log(ngx.ERR, "Failed to connect to Redis: ", err)
        return true  -- Allow request if Redis is unavailable
    end
    
    local count, err = red:get(key)
    if not count or count == ngx.null then
        count = 0
    else
        count = tonumber(count)
    end
    
    if count >= limit then
        return false
    end
    
    -- Increment counter
    red:incr(key)
    red:expire(key, window)
    red:close()
    
    return true
end

-- Log request details
function _M.log_request()
    local request_id = ngx.var.request_id or "unknown"
    local remote_addr = ngx.var.remote_addr
    local user_agent = ngx.var.http_user_agent or "unknown"
    local request_uri = ngx.var.request_uri
    
    ngx.log(ngx.INFO, "Request ID: ", request_id, 
                      " IP: ", remote_addr, 
                      " URI: ", request_uri, 
                      " UA: ", user_agent)
end

-- Custom error response
function _M.error_response(status, message)
    ngx.status = status
    ngx.header.content_type = "application/json"
    local response = {
        error = true,
        message = message,
        timestamp = ngx.now()
    }
    
    local cjson = require "cjson"
    ngx.say(cjson.encode(response))
    ngx.exit(status)
end

-- Health check for backend services
function _M.health_check()
    local http = require "resty.http"
    local httpc = http.new()
    
    local services = {
        frontend = "http://frontend:4321/",
        backend = "http://backend:8000/api/health/",
        cms = "http://cms:1337/"
    }
    
    local status = {}
    
    for name, url in pairs(services) do
        local res, err = httpc:request_uri(url, {
            method = "GET",
            timeout = 2000,  -- 2 seconds timeout
        })
        
        if res and res.status == 200 then
            status[name] = "healthy"
        else
            status[name] = "unhealthy"
            ngx.log(ngx.ERR, "Health check failed for ", name, ": ", err or "HTTP " .. (res and res.status or "unknown"))
        end
    end
    
    httpc:close()
    return status
end

return _M

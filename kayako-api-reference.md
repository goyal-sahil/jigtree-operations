# Kayako API v1 Reference

> Auto-extracted via Jina Reader from https://developer.kayako.com



---

## Reference


### Introduction

Title: Introduction - Reference | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/reference/introduction/

Published Time: Tue, 14 Aug 2018 04:32:23 GMT

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   REFERENCE

The Kayako API (the API) is our proprietary REST API implementation.

The API is based on resources. A resource is an object that the API end point fetches and/or manipulates. A collection (an array of resources) is a resource as well.

A resource **can** support the following basic REST API actions (that are actually HTTP methods):

*   `GET` for retrieving the resource
*   `POST` for creating the resource
*   `PUT` for modifying the resource
*   `DELETE` for removing the resource

Read more about REST API [here](https://en.wikipedia.org/wiki/Representational_state_transfer).

Kayako API is "RESTless".

## Available API Endpoints

*   [Users](https://developer.kayako.com/api/v1/users/activities/)
*   [Cases](https://developer.kayako.com/api/v1/cases/activities/)
*   [Insights](https://developer.kayako.com/api/v1/insights/cases/)
*   [Search](https://developer.kayako.com/api/v1/search/search/)
*   [Automation](https://developer.kayako.com/api/v1/automation/endpoints/)

*   [Mail](https://developer.kayako.com/api/v1/mail/mailboxes/)
*   [Twitter](https://developer.kayako.com/api/v1/twitter/accounts/)
*   [Help Center](https://developer.kayako.com/api/v1/help_center/articles/)
*   [Facebook](https://developer.kayako.com/api/v1/facebook/accounts/)
*   [Event](https://developer.kayako.com/api/v1/event/events/)

*   [General](https://developer.kayako.com/api/v1/general/autocomplete/)

## Request

To perform an API action you need to make an API request.

Actions can support "arguments" - variables that are specified in the [query string](https://en.wikipedia.org/wiki/Query_string) of the HTTP request (they should be added to the URI in the request line). There are "common" API arguments (like `fields`, see [Partial Output](https://developer.kayako.com/api/v1/reference/partial_output/)), which can be used for all API requests. Among these common arguments there are also special "server" arguments, that start with `_` (e.g., `_empty`, see [Special Options](https://developer.kayako.com/api/v1/reference/special_options/)).

In addition to arguments the API intensively uses HTTP headers _(which are **preferred**, if argument-based alternatives exist)_. Thus, caching and concurrency control are implemented using `If-Match`, `If-None-Match`, `If-Modified-Since` and `If-Unmodified-Since` HTTP headers (see [Caching](https://developer.kayako.com/api/v1/reference/caching/)).

Main properties of resources are to be sent using "parameters" - variables that are delivered in the request body _(which is used only for `POST` and `PUT` actions)_. The request body is usually formatted accordingly to the `application/x-www-form-urlencoded` content type (see [Request](https://developer.kayako.com/api/v1/reference/request/)).

Here is a sample API request to the [Test](https://developer.kayako.com/api/v1/general/tests/) end point:

```
POST /api/v1/tests?_empty=false HTTP/1.1
Host: brewfictus.kayako.com
Accept: */*
Content-Length: 43
Cache-Control: no-cache
Content-Type: application/x-www-form-urlencoded

name=Caryn+Pryor&array_items=1,2,3&is_boolean=true
```

And here is how CURL can be used to send such request:

See also [Request](https://developer.kayako.com/api/v1/reference/request/).

## Response

An API request, that has been sent to the API service, returns an API response.

The HTTP status code of the API response is the first thing to check for errors (except JSONP, see [Using JavaScript](https://developer.kayako.com/api/v1/reference/using_javascript/)).

API responses come with the response body (except cached responses, see [Caching](https://developer.kayako.com/api/v1/reference/caching/)), that delivers the special response JSON message. The response message contains the resource (if any) under the special `data` field. In addition, the message contains the `status` field, that delivers the HTTP status code, and **can** contain errors, notifications, logs and more (see [Response](https://developer.kayako.com/api/v1/reference/response/)).

Here is a sample of an API response:

```
HTTP/1.1 200 OK
Content-Type: application/json
Date: Thu, 10 Sep 2015 16:17:04 GMT
Expires: Thu, 10 Sep 2015 16:17:04 +0000
ETag: "c5096115d7d05d842514f96831aa852f"
Last-Modified: Thu, 10 Sep 2015 16:17:04 +0000
Content-Location: https://brewfictus.kayako.com/api/v1/tests/99
Content-Length: 369
X-API-Version: 1

{
    "status": 201,
    "data": {
        "id": 99,
        "name": "Caryn Pryor",
        "authentication_scheme": "NONE",
        "array_items": [
            1,
            2,
            3
        ],
        "is_boolean": true,
        "resource_type": "test",
        "resource_url": "https://brewfictus.kayako.com/api/v1/tests/99"
    },
    "resource": "test"
}
```

See also [Response](https://developer.kayako.com/api/v1/reference/response/).

## Authentication

The vast majority of API end points require the user to be authenticated.

The easiest way to authenticate is to use the standard Basic HTTP authentication scheme (there is also a more flexible OAuth 2.0 scheme, see [Authentication](https://developer.kayako.com/api/v1/reference/authentication/)). The Basic HTTP scheme expects the username and password to be base64-encoded and added to the `Authorization` HTTP header as follows (check also [this page](https://en.wikipedia.org/wiki/Basic_access_authentication)):

```
Authorization: Basic base64($username:$password)
```

This authentication scheme is also supported by CURL:

See also [Authentication](https://developer.kayako.com/api/v1/reference/authentication/).

## Testing

To test the Kayako API you can use the special public [Test](https://developer.kayako.com/api/v1/general/tests/) resource.

For example:

### GET

To retrieve multiple test resources:

To retrieve the test resource with ID = 1:

### POST

To create a test resource:

### PUT

To update the test resource with ID = 1:

To update multiple test resources at once:

### DELETE

To remove the test resource with ID = 999:

To remove multiple test resources at once:




### Authentication

Title: Authentication - Reference | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/reference/authentication/

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   REFERENCE

Contents

*   [1 Schemes](https://developer.kayako.com/api/v1/reference/authentication/#schemes-1)

    *   [1.1 Basic HTTP Authentication](https://developer.kayako.com/api/v1/reference/authentication/#basic-http-authentication-1.1)

    
        *   [1.1.1 OTP authentication step](https://developer.kayako.com/api/v1/reference/authentication/#otp-authentication-step-1.1.1)
        *   [1.1.2 Password update step](https://developer.kayako.com/api/v1/reference/authentication/#password-update-step-1.1.2)

    *   [1.2 OAuth 2.0](https://developer.kayako.com/api/v1/reference/authentication/#oauth-2-0-1.2)

    
        *   [1.2.1 API scopes](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

    *   [1.3 Fingerprint authentication](https://developer.kayako.com/api/v1/reference/authentication/#fingerprint-authentication-1.3)
    *   [1.4 Remember Me Token Authentication](https://developer.kayako.com/api/v1/reference/authentication/#remember-me-token-authentication-1.4)

*   [2 Session](https://developer.kayako.com/api/v1/reference/authentication/#session-2)

## [](https://developer.kayako.com/api/v1/reference/authentication/#schemes-1)Schemes

The Kayako API supports the following authentication schemes:

### [](https://developer.kayako.com/api/v1/reference/authentication/#basic-http-authentication-1.1)Basic HTTP Authentication

The Basic HTTP authentication is an authentication standard for the HTTP protocol (while it's considered to be insecure).

To authenticate using the Basic HTTP authentication protocol you need to use the `Authorization` HTTP header as follows:

```
Authorization: Basic base64($email:$password)
```

_Important:_ While we always use the HTTPS protocol for transferring data to the server, the Basic HTTP authentication should still be avoided, when possible, as it operates the user password directly.

On successful Basic HTTP authentication you should receive an API response with an additional `session_id` field:

```
{
    "status": 200,
    "session_id": "1P8xuJ4UQIWrRin2HU35V390e1d28ad230d0957c783bed37a4abe1bf6adbbB5Bw0Ja5PWO0v26lEa6z"
}
```

Use this session ID to authenticate in all subsequent API requests. See [Session](https://developer.kayako.com/api/v1/reference/authentication/#session-2) how.

Do **not** supply the Basic HTTP authentication header in subsequent API requests (after you have received the session ID).

* * *

In some conditions (depends on system and user configuration) a valid Basic HTTP authentication request can return an "error". If you get it, this means, that you need to go through some additional authentication step(s) to complete the authentication process (and get the session ID).

Such "error" response always comes with an additional `auth_token` field, the value of which you'll need to complete the authentication:

```
"auth_token": "qhrejryxGtnLQe40nNetYPLp5H9sCMnG82ULd7jANTcI8hW61bDoTUGdp64u"
```

During the very next authentication step this token should be put into the `X-Token` HTTP header:

```
X-Token: qhrejryxGtnLQe40nNetYPLp5H9sCMnG82ULd7jANTcI8hW61bDoTUGdp64u
```

Or into the `_token` argument.

Each authentication step has its own authentication token, that **cannot** be used for other steps (i.e. you can't use for password update the token, that was generated for OTP).

Only the Basic HTTP authentication scheme has these additional steps.

#### [](https://developer.kayako.com/api/v1/reference/authentication/#otp-authentication-step-1.1.1)OTP authentication step

The Basic HTTP authentication can "halt", if the two-factor authentication is enabled for the user.

The two-factor authentication can be enabled for a user in the Kayako administration area.

In this case the following response is returned by the API service:

```
{
    "status": 403,
    "errors": [
        {
            "code": "OTP_EXPECTED",
            "message": "To complete authentication you need to provide the one-time password",
            "more_info": "https://developer.kayako.com/api/v1/reference/errors/OTP_EXPECTED"
        }
    ],
    "notifications": [
        {
            "type": "INFO",
            "message": "Two-factor authentication is enabled for your account"
        }
    ],
    "auth_token": "dPQBJfPG5cGYd6MMPtowGz93x3uSN7Vc7yBw3JrKL5owqfowKFda4mezGefo5QDmRnxyV2"
}
```

If this is the case, ask the user for OTP (one-time password) and pass it in the `X-OTP` HTTP header:

```
X-Token: dPQBJfPG5cGYd6MMPtowGz93x3uSN7Vc7yBw3JrKL5owqfowKFda4mezGefo5QDmRnxyV2
X-OTP: 379069
```

Alternatively, you can pass it in the `_otp` argument.

Users should use the [Google Authenticator](https://en.wikipedia.org/wiki/Google_Authenticator) to get the OTP.

If the OTP is correct, the user will get authenticated (and the session ID will be returned) or another authentication step will be requested by the API service.

#### [](https://developer.kayako.com/api/v1/reference/authentication/#password-update-step-1.1.2)Password update step

The Basic HTTP authentication can also "halt", if the user's password has expired.

The password expiration policy can be configured using the Kayako UI.

If this happens, the following response is returned by the API service:

This means, that to complete the authentication you must update the user's password.

This can be done using the [Change password](https://developer.kayako.com/api/v1/users/profile/#Change-password) end point. The difference with the normal password update procedure is that you provide the authentication token (instead of being authenticated) and do not need to pass the old password:

```
PUT /api/v1/profile/password.json HTTP/1.1
Host: brewfictus.kayako.com
X-Token: eGDPtbMcQCXBLwef58Kz4HBCuaRPyq5QCMqFLD1iUUIGxUq48bADFUv2gRdxRJXhmduY0t37BAXeaaT1

new_password=xgw4sUBXQKaQT3pg
```

### [](https://developer.kayako.com/api/v1/reference/authentication/#oauth-2-0-1.2)OAuth 2.0

OAuth 2.0 is the de facto standard for API authentication nowadays.

Generally, OAuth 2.0 authentication is based on the access token. This token is like a password generated specially to be used by a particular API client.

To authenticate you should supply the OAuth 2.0 access token in the `Authorization` HTTP header as follows:

```
Authorization: Bearer 4b1442a6-38d1-ae34-9d55-adf5b41d6417
```

Alternatively, you can use the `access_token` query argument.

Usually, OAuth 2.0 client libraries add the access token header or argument automatically, so you do not need to care about these details. Most such libraries (if you use them, what is **recommended**) can also retrieve or refresh access tokens transparently.

* * *

An access token can be retrieved with a special OAuth 2.0 request sent to the following end points:

Authorization`/oauth/token/authorize`Token`/oauth/token`
The following grant types are currently supported by Kayako:

Authorization Code The most commonly used and **recommended** grant type.User Credentials The grant type, that involves username and password.Refresh token The grant type, that is to be used to refresh the access token on a regular basis.
See also the [OAuth 2.0 documentation](http://oauth.net/2/) for more details.

#### [](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)API scopes

API scopes let restricting access of the API client to specific parts of the API service's functionality.

If the API end point is associated with the scope, which is not allowed for the API client, or if no scope is associated with it, the access to such end point for the API client will be rejected.

_To make sure, that the user agrees to grant access to corresponding functionality for a third-party app, the service lists requested scopes, when asking the user to authorize the app._

Currently, Kayako supports the following scopes:

users Access to [users](https://developer.kayako.com/api/v1/users/users/) (including [identities](https://developer.kayako.com/api/v1/users/identities/)), [organizations](https://developer.kayako.com/api/v1/users/organizations/) and [teams](https://developer.kayako.com/api/v1/users/teams/)conversations Access to [cases](https://developer.kayako.com/api/v1/cases/cases/) (including [views](https://developer.kayako.com/api/v1/cases/views/))insights Access to [insights](https://developer.kayako.com/api/v1/insights/cases/)search Access to [unified search](https://developer.kayako.com/api/v1/search/search/) (indirect access to users, cases and so on)configuration Configuration of the Kayako instance (including [SLAs](https://developer.kayako.com/api/v1/cases/service_level_agreements/), [automations](https://developer.kayako.com/api/v1/automation/endpoints/), [brands](https://developer.kayako.com/api/v1/general/brands/), custom fields and more)
Each of the scopes can be specified (in token retrieval request by the API client) with the optional access level (separated from the scope by colon `:`):

read Read-only access to data write Full access to data
If the access level is not specified, `:write` is assumed.

### [](https://developer.kayako.com/api/v1/reference/authentication/#fingerprint-authentication-1.3)Fingerprint authentication

For certain endpoints, the Kayako API allows access without requiring user credentials or a [Session ID](https://developer.kayako.com/api/v1/reference/authentication/#session-2).

Such access is very limited, and should only be used when a valid session cannot be established (applications targeted primarily towards unregistered users). One such use case is [Kayako Messenger](https://www.kayako.com/glossary/messenger), which is embeddable on other websites.

Fingerprint IDs are secret tokens (UUIDs) that are generated by the client and supplied via the `X-Fingerprint-ID` header. For cases where supplying a header is not possible, the query parameter `_fingerprint_id` can be used instead.

A client using fingerprint authentication can only view resources that were created with that very fingerprint ID.

### [](https://developer.kayako.com/api/v1/reference/authentication/#remember-me-token-authentication-1.4)Remember Me Token Authentication

To authenticate using _Remember Me Token_ (stored on the client side), 2 headers are required `X-RememberMe` and `X-Fingerprint`.

*   `X-RememberMe` is received on a successful login using username and password. It is a long encrypted alphanumeric string.
*   `X-Fingerprint` is a random unique device identifier string.

The client-side is requested to send these headers with every request if the _Remember Me Token_ is available.

## [](https://developer.kayako.com/api/v1/reference/authentication/#session-2)Session

_Session is not considered to be a complete separate authentication scheme as it is to be used by all other ones. Thus, to create a session you first need to authenticate using any of the main schemes._

_Nevertheless, the session authentication can be considered to be the secondary authentication scheme for the Basic HTTP Authentication._

After the initial authentication, i.e. the first API request with authentication data, the API service returns a response with an additional `session_id` field delivering the ID of the just created session:

```
{
    "status": 200,
    "session_id": "1P8xuJ4UQIWrRin2HU35V390e1d28ad230d0957c783bed37a4abe1bf6adbbB5Bw0Ja5PWO0v26lEa6z"
}
```

This session ID **must** be supplied with all subsequent API requests in the `X-Session-ID` HTTP header:

```
X-Session-ID: 1P8xuJ4UQIWrRin2HU35V390e1d28ad230d0957c783bed37a4abe1bf6adbbB5Bw0Ja5PWO0v26lEa6z
```

Alternatively, the `_session_id` argument can be used instead.

_Important:_ If you do not provide the session ID, each new request will create a new session. This won't only make your API requests be processed slower, but will also make it impossible for you to use some API features.




### Request

Title: Request - Reference | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/reference/request/

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   REFERENCE

Contents

*   [1 Headers](https://developer.kayako.com/api/v1/reference/request/#headers-1)

    *   [1.1 Accept](https://developer.kayako.com/api/v1/reference/request/#accept-1.1)
    *   [1.2 Content-Length](https://developer.kayako.com/api/v1/reference/request/#content-length-1.2)
    *   [1.3 Content-Type](https://developer.kayako.com/api/v1/reference/request/#content-type-1.3)

*   [2 Arguments and parameters](https://developer.kayako.com/api/v1/reference/request/#arguments-and-parameters-2)
*   [3 Body format](https://developer.kayako.com/api/v1/reference/request/#body-format-3)

    *   [3.1 URL-encoded](https://developer.kayako.com/api/v1/reference/request/#url-encoded-3.1)

    
        *   [3.1.1 CURL](https://developer.kayako.com/api/v1/reference/request/#curl-3.1.1)

    *   [3.2 JSON](https://developer.kayako.com/api/v1/reference/request/#json-3.2)

    
        *   [3.2.1 CURL](https://developer.kayako.com/api/v1/reference/request/#curl-3.2.1)

    *   [3.3 Multi-part](https://developer.kayako.com/api/v1/reference/request/#multi-part-3.3)

    
        *   [3.3.1 CURL](https://developer.kayako.com/api/v1/reference/request/#curl-3.3.1)

    *   [3.4 File upload](https://developer.kayako.com/api/v1/reference/request/#file-upload-3.4)

Here is a sample of the API request:

```
POST /api/v1/tests?_empty=false HTTP/1.1
Host: brewfictus.kayako.com
Accept: */*
Content-Length: 43
Content-Type: application/x-www-form-urlencoded

name=Caryn+Pryor&array_items=1,2,3&is_boolean=true
```

A valid API request has the request line with optional arguments (e.g. `_empty`), HTTP request headers (e.g. `Content-Type`) and sometimes the body, that usually contains parameters (e.g. `is_boolean`).

Here are some of HTTP headers that can/should be used in the requests:

Other request headers are reviewed in [Authentication](https://developer.kayako.com/api/v1/reference/authentication/), [File Upload](https://developer.kayako.com/api/v1/reference/file_upload/), [Caching](https://developer.kayako.com/api/v1/reference/caching/), [Security](https://developer.kayako.com/api/v1/reference/security/), [Special Options](https://developer.kayako.com/api/v1/reference/special_options/) and [Using JavaScript](https://developer.kayako.com/api/v1/reference/using_javascript/).

### [](https://developer.kayako.com/api/v1/reference/request/#accept-1.1)Accept

The `Accept` HTTP header **must** include `application/json` or `*/*`.

```
Accept: application/json
```

### [](https://developer.kayako.com/api/v1/reference/request/#content-length-1.2)Content-Length

Be sure to specify the size of the request body in the `Content-Length` HTTP header:

```
Content-Length: 53
```

### [](https://developer.kayako.com/api/v1/reference/request/#content-type-1.3)Content-Type

Depending on the format of the request body the `Content-Type` HTTP header must be set to:

*   `application/x-www-form-urlencoded` for the URL-encoded format.
*   `application/json` for the JSON format.
*   `multipart/form-data`**with** the boundary for the Multi-part format.

```
Content-Type: application/x-www-form-urlencoded
```

## [](https://developer.kayako.com/api/v1/reference/request/#arguments-and-parameters-2)Arguments and parameters

We distinguish parameters, that are specified in the request URL (query), which we name "arguments", and parameters, that are specified in the request body, which we name just "parameters".

"Arguments" and "parameters" can be combined in a single API request (therefore, in theory, they can even have the same names).

Some special arguments are reviewed in [Partial Output](https://developer.kayako.com/api/v1/reference/partial_output/), [Pagination](https://developer.kayako.com/api/v1/reference/pagination/), [File Upload](https://developer.kayako.com/api/v1/reference/file_upload/), [Special Options](https://developer.kayako.com/api/v1/reference/special_options/) and [Using JavaScript](https://developer.kayako.com/api/v1/reference/using_javascript/).

## [](https://developer.kayako.com/api/v1/reference/request/#body-format-3)Body format

Body of a valid API request **must** be in one of the following formats:

### [](https://developer.kayako.com/api/v1/reference/request/#url-encoded-3.1)URL-encoded

This is a standard format of web forms and the simplest one.

This format is identified by the `application/x-www-form-urlencoded` value of the `Content-Type` HTTP request header:

```
Content-Type: application/x-www-form-urlencoded
```

In this format the body of the request must contain a single (long) line with `name=value` pairs of parameters joined by `&`. Values must be URL-encoded.

Example:

```
name=Caryn+Pryor&integer_number=123&float_number=1.5&&date=1441118415&is_boolean=1&array_items[]=1&array_items[]=2
```

For details about this format check [RFC 3986](https://tools.ietf.org/html/rfc3986).

#### [](https://developer.kayako.com/api/v1/reference/request/#curl-3.1.1)CURL

Example of the CURL command, that uses this format:

### [](https://developer.kayako.com/api/v1/reference/request/#json-3.2)JSON

JSON is a standard format for APIs nowadays and the most flexible one. It is also used by the Kayako API as the response format.

For a JSON request the `Content-Type` HTTP request header must be set to `application/json`:

```
Content-Type: application/json
```

The body of the request must contain a valid JSON object.

Example:

```
{
    "name": "Caryn Pryor",
    "integer_number": 123,
    "float_number": 1.5,
    "date": "2015-09-01T14:45:04+05:00",
    "is_boolean": true,
    "array_items": [
        1,
        2
    ]
}
```

You can read more about JSON [here](http://json.org/).

#### [](https://developer.kayako.com/api/v1/reference/request/#curl-3.2.1)CURL

Example of the CURL command, that uses this format:

### [](https://developer.kayako.com/api/v1/reference/request/#multi-part-3.3)Multi-part

This is another standard format of web forms and the only one, that can be used to upload files. It's also the most complicated one.

_Important:_**Do not** use this format unless you need to upload files.

This format is identified by the `Content-Type` HTTP request header, that must be set to `multipart/form-data` and also must include the `boundary`:

```
Content-Type: multipart/form-data; boundary="1modcYGLAATJpapo8jhD4UwHbF5asu4u"
```

As this is one of the request formats, that can be used to upload files, it is also described in details in [File upload](https://developer.kayako.com/api/v1/reference/file_upload/).

If this format is used to deliver values for parameters, the corresponding "part" must include the parameter name in the `name` option of the `Content-Disposition` HTTP header as follows:

```
Content-Disposition: form-data; name="parameter_name"
```

The request body of this format must contain one or more parts separated by the boundary.

Example:

```
--1modcYGLAATJpapo8jhD4UwHbF5asu4u
Content-Disposition: form-data; name="name"

Caryn Pryor
--1modcYGLAATJpapo8jhD4UwHbF5asu4u
Content-Disposition: form-data; name="integer_number"

123
--1modcYGLAATJpapo8jhD4UwHbF5asu4u
Content-Disposition: form-data; name="float_number"

1.5
--1modcYGLAATJpapo8jhD4UwHbF5asu4u
Content-Disposition: form-data; name="date"

2015-09-01T14:45:04Z
--1modcYGLAATJpapo8jhD4UwHbF5asu4u
Content-Disposition: form-data; name="is_boolean"

1
--1modcYGLAATJpapo8jhD4UwHbF5asu4u
Content-Disposition: form-data; name="array_items[]"

1
--1modcYGLAATJpapo8jhD4UwHbF5asu4u
Content-Disposition: form-data; name="array_items[]"

2
--1modcYGLAATJpapo8jhD4UwHbF5asu4u--
```

Check also [RFC 2388](https://tools.ietf.org/html/rfc2388) for more details about this format.

#### [](https://developer.kayako.com/api/v1/reference/request/#curl-3.3.1)CURL

Example of the CURL command, that uses this format:

### [](https://developer.kayako.com/api/v1/reference/request/#file-upload-3.4)File upload

For request formats, that can be used to upload files, check [File upload](https://developer.kayako.com/api/v1/reference/file_upload/).




### Response

Title: Response - Reference | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/reference/response/

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   REFERENCE

Contents

*   [1 Status code](https://developer.kayako.com/api/v1/reference/response/#status-code-1)
*   [2 Headers](https://developer.kayako.com/api/v1/reference/response/#headers-2)
*   [3 Body](https://developer.kayako.com/api/v1/reference/response/#body-3)

    *   [3.1 Main fields](https://developer.kayako.com/api/v1/reference/response/#main-fields-3.1)
    *   [3.2 Errors, notifications and logs](https://developer.kayako.com/api/v1/reference/response/#errors-notifications-and-logs-3.2)

    
        *   [3.2.1 Errors](https://developer.kayako.com/api/v1/reference/response/#errors-3.2.1)
        *   [3.2.2 Notifications](https://developer.kayako.com/api/v1/reference/response/#notifications-3.2.2)
        *   [3.2.3 Logs](https://developer.kayako.com/api/v1/reference/response/#logs-3.2.3)

Here is a sample of the API response:

```
HTTP/1.1 200 OK
Date: Mon, 07 Sep 2015 23:02:09 GMT
Expires: Mon, 07 Sep 2015 23:02:09 +0000
ETag: "35676ce12ba0543c84489f3c393f5491"
Last-Modified: Mon, 07 Sep 2015 23:02:09 +0000
Content-Length: 245
X-API-Version: 1
Content-Type: application/json

{
    "status": 200,
    "data": {
        "id": 1,
        "name": "Test 1",
        "authentication_scheme": "NONE",
        "resource_type": "test",
        "resource_url": "https://brewfictus.kayako.com/api/v1/tests/1"
    },
    "resource": "test"
}
```

An API response has the status line, HTTP response headers (e.g., `ETag`) and often the body.

## [](https://developer.kayako.com/api/v1/reference/response/#status-code-1)Status code

An API response as a HTTP response includes the HTTP status code that can have the following values:

| Code | Message | Description |
| --- | --- | --- |
| 200 | OK | The default code for successful responses. |
| 201 | Created | A resource has been created. |
| 304 | Not Modified | The cached resource has not been modified. Responses with this code do not include the body. See also [Caching](https://developer.kayako.com/api/v1/reference/caching/). |
| 400 | Bad Request | The request was malformed (and needs to be fixed before retrying). |
| 401 | Unauthorized | The resource requires the user to be authenticated. See also [Authentication](https://developer.kayako.com/api/v1/reference/authentication/). |
| 403 | Forbidden | The access to the resource is not allowed for the user. |
| 404 | Not Found | The resource does not exist or has been removed. |
| 405 | Method Not Allowed | Used HTTP method is not supported for the resource. |
| 406 | Not Acceptable | The `Accept` HTTP header of the request is missing or does not allow `application/json`. See [Request](https://developer.kayako.com/api/v1/reference/request/). |
| 412 | Precondition Failed | The request included a condition, that failed. See also [Caching](https://developer.kayako.com/api/v1/reference/caching/). |
| 426 | Upgrade Required | The API client or the system license should be upgraded. |
| 429 | Too Many Requests | The request has been rate limited. See also [Rate Limiting](https://developer.kayako.com/api/v1/reference/rate_limiting/). |
| 454 | Session Not Found | The session could not be loaded. See [Authentication](https://developer.kayako.com/api/v1/reference/authentication/). |
| 500 | Internal Server Error | There was an error on the server. |

The API service avoids using HTTP headers for delivering important information to API clients, except the `Retry-After` header that is described in [Rate Limiting](https://developer.kayako.com/api/v1/reference/rate_limiting/) and the `X-CSRF-Token` header that is described in [Security](https://developer.kayako.com/api/v1/reference/security/).

## [](https://developer.kayako.com/api/v1/reference/response/#body-3)Body

The body of the API response is a special JSON object, that delivers meta data and resource information to the API client.

### [](https://developer.kayako.com/api/v1/reference/response/#main-fields-3.1)Main fields

Here are the most important fields of the response message:

Status The value of this field is (normally) identical to the HTTP status code of the API response.Data This field delivers the main information. It contains either the resource or the collection (i.e. array of resources).Resource This field contains the type of the resource delivered in the `data` field. For collections it's the type of the contained resource.Total Count This field is returned only with collections and contains the total number of items in the collection.
### [](https://developer.kayako.com/api/v1/reference/response/#errors-notifications-and-logs-3.2)Errors, notifications and logs

The response can include three types of special messages:

*   **Errors** are intended for API clients (and, therefore, are not localized).
*   **Notifications** are intended for end users (and are localized).
*   **Logs** are to be logged by API clients and are intended for their developers and maintainers.

#### [](https://developer.kayako.com/api/v1/reference/response/#errors-3.2.1)Errors

A response indicates an error, if its status is not **200** (OK) or **201** (Created) and the `errors` response field contains one or more error objects.

If the API client receives a response with error(s), it should analyze the `code` field of each error object and perform appropriate actions (report the error to the user, fix the request and retry, and so on).

Some error objects can include the following additional fields:

Parameter The `parameter` field holds the name of the parameter, that caused the error.Parameters If there are several parameters, that caused the error, they are listed in the `parameters` field.Pointer If the parameter is an array or a JSON object, the error object can additionally include the `pointer` field containing the exact path to the value in the parameter.
Example:

See also [Errors](https://developer.kayako.com/api/v1/reference/errors/ACTION_FAILED/) for what each error code means.

#### [](https://developer.kayako.com/api/v1/reference/response/#notifications-3.2.2)Notifications

Any response, successful or not, can include one or more notification objects in the `notifications` field.

The notification object contains the `type` field, that indicates the severity of the message.

The type can be:

*   `ERROR`
*   `WARNING`
*   `INFO`
*   `SUCCESS`

Each notification message (of any type) **must** be displayed to the user by the API client.

Additionally, the notification object can include the following fields:

Sticky If the `sticky` field is set to `true`, the corresponding notification message should remain on the screen of the API client as reasonably long as possible.Related URL If the `related_url` field contains a URL, the API client may provide a UI element somewhere in the notification window, that would allow the user to check the resource represented by this URL. **Or**:Related HREF If the `related_href` field contains a URL, the API client should provide a UI element somewhere in the notification window, that would allow the user to open this URL in a browser.Related label If the `related_label` field is specified, its value should be used as a label for the aforementioned UI element.
Example:

```
{
    "status": 200,
    "notifications": [
        {
            "type": "INFO",
            "message": "A message has been sent to your email",
        }
    ]
}
```

#### [](https://developer.kayako.com/api/v1/reference/response/#logs-3.2.3)Logs

Any response, successful or not, can include one or more log messages in the `logs` field.

The log object contains the `level` field, that indicates the severity of the problem.

The level can be:

*   `ERROR`
*   `WARNING`
*   `NOTICE`

Logs are intended for developers and administrators of the API client and contain important information about issues in its code or configuration. Therefore, the API client **should** write logs to some place, where developers and administrators can read them.

Example:

```
{
    "status": 200,
    "logs": [
        {
            "level": "NOTICE",
            "message": "To avoid long delays instead of supplying username and password with each request use just the session id"
        }
    ]
}
```




### Data Types

Title: Data Types - Reference | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/reference/data_types/

Markdown Content:
# Data Types - Reference | Kayako Developers

[![Image 1](https://developer.kayako.com/img/kayako-logo.png)](https://developer.kayako.com/)

*     
*   [Docs](https://developer.kayako.com/docs/single_sign_on/introduction/)
*   [API](https://developer.kayako.com/api/v1/reference/introduction/)
*   [SDK](https://developer.kayako.com/sdk/java/integration_guide/)
*   [Messenger![Image 2: beta](https://developer.kayako.com/img/new.png)](https://developer.kayako.com/messenger/home/)

*     
*   [Docs](https://developer.kayako.com/docs/single_sign_on/introduction/)
*   [API](https://developer.kayako.com/api/v1/reference/introduction/)
*   [SDK](https://developer.kayako.com/sdk/java/integration_guide/)
*   [Messenger![Image 3: beta](https://developer.kayako.com/img/new.png)](https://developer.kayako.com/messenger/home/)

Reference

*   [Reference](https://developer.kayako.com/api/v1/reference/introduction/)
Core*   [Users](https://developer.kayako.com/api/v1/users/activities/)
*   [Cases](https://developer.kayako.com/api/v1/cases/activities/)
*   [Insights](https://developer.kayako.com/api/v1/insights/cases/)
*   [Search](https://developer.kayako.com/api/v1/search/search/)
*   [Automation](https://developer.kayako.com/api/v1/automation/endpoints/)
Channels*   [Twitter](https://developer.kayako.com/api/v1/twitter/accounts/)
*   [Facebook](https://developer.kayako.com/api/v1/facebook/accounts/)
*   [Mail](https://developer.kayako.com/api/v1/mail/mailboxes/)
*   [Event](https://developer.kayako.com/api/v1/event/events/)
*   [Help Center](https://developer.kayako.com/api/v1/help_center/articles/)
Others*   [General](https://developer.kayako.com/api/v1/general/autocomplete/)

*   [Introduction](https://developer.kayako.com/api/v1/reference/introduction/)
*   [Authentication](https://developer.kayako.com/api/v1/reference/authentication/)
*   [Request](https://developer.kayako.com/api/v1/reference/request/)
*   [Response](https://developer.kayako.com/api/v1/reference/response/)
*   [Data Types](https://developer.kayako.com/api/v1/reference/data_types/)
*   [Partial Output](https://developer.kayako.com/api/v1/reference/partial_output/)
*   [Pagination](https://developer.kayako.com/api/v1/reference/pagination/)
*   [File Upload](https://developer.kayako.com/api/v1/reference/file_upload/)
*   [Caching](https://developer.kayako.com/api/v1/reference/caching/)
*   [Security](https://developer.kayako.com/api/v1/reference/security/)
*   [Rate Limiting](https://developer.kayako.com/api/v1/reference/rate_limiting/)
*   [Special Options](https://developer.kayako.com/api/v1/reference/special_options/)
*   [Using Javascript](https://developer.kayako.com/api/v1/reference/using_javascript/)
*   [Errors](https://developer.kayako.com/api/v1/reference/data_types/)
    *   [ACTION_FAILED](https://developer.kayako.com/api/v1/reference/errors/ACTION_FAILED)
    *   [ANY_FIELD_REQUIRED](https://developer.kayako.com/api/v1/reference/errors/ANY_FIELD_REQUIRED)
    *   [APP_NOT_FOUND](https://developer.kayako.com/api/v1/reference/errors/APP_NOT_FOUND)
    *   [APP_REST_NOT_AVAILABLE](https://developer.kayako.com/api/v1/reference/errors/APP_REST_NOT_AVAILABLE)
    *   [ASSOCIATE_NOT_FOUND](https://developer.kayako.com/api/v1/reference/errors/ASSOCIATE_NOT_FOUND)
    *   [AUTHENTICATION_FAILED](https://developer.kayako.com/api/v1/reference/errors/AUTHENTICATION_FAILED)
    *   [AUTHENTICATION_LOCKED](https://developer.kayako.com/api/v1/reference/errors/AUTHENTICATION_LOCKED)
    *   [AUTHORIZATION_REQUIRED](https://developer.kayako.com/api/v1/reference/errors/AUTHORIZATION_REQUIRED)
    *   [CHECKSUM_MISMATCH](https://developer.kayako.com/api/v1/reference/errors/CHECKSUM_MISMATCH)
    *   [CONDITION_REQUIRED](https://developer.kayako.com/api/v1/reference/errors/CONDITION_REQUIRED)
    *   [CONTENT_NOT_AVAILABLE](https://developer.kayako.com/api/v1/reference/errors/CONTENT_NOT_AVAILABLE)
    *   [CREDENTIAL_EXPIRED](https://developer.kayako.com/api/v1/reference/errors/CREDENTIAL_EXPIRED)
    *   [CSRF_FAILED](https://developer.kayako.com/api/v1/reference/errors/CSRF_FAILED)
    *   [DELETION_FAILED](https://developer.kayako.com/api/v1/reference/errors/DELETION_FAILED)
    *   [EXCEPTION_CAUGHT](https://developer.kayako.com/api/v1/reference/errors/EXCEPTION_CAUGHT)
    *   [FEATURE_NOT_AVAILABLE](https://developer.kayako.com/api/v1/reference/errors/FEATURE_NOT_AVAILABLE)
    *   [FIELD_DUPLICATE](https://developer.kayako.com/api/v1/reference/errors/FIELD_DUPLICATE)
    *   [FIELD_EMPTY](https://developer.kayako.com/api/v1/reference/errors/FIELD_EMPTY)
    *   [FIELD_INVALID](https://developer.kayako.com/api/v1/reference/errors/FIELD_INVALID)
    *   [FIELD_REQUIRED](https://developer.kayako.com/api/v1/reference/errors/FIELD_REQUIRED)
    *   [FORMAT_NOT_ACCEPTABLE](https://developer.kayako.com/api/v1/reference/errors/FORMAT_NOT_ACCEPTABLE)
    *   [HTTPS_REQUIRED](https://developer.kayako.com/api/v1/reference/errors/HTTPS_REQUIRED)
    *   [LICENSE_EXPIRED](https://developer.kayako.com/api/v1/reference/errors/LICENSE_EXPIRED)
    *   [LICENSE_LIMIT_REACHED](https://developer.kayako.com/api/v1/reference/errors/LICENSE_LIMIT_REACHED)
    *   [METHOD_NOT_SUPPORTED](https://developer.kayako.com/api/v1/reference/errors/METHOD_NOT_SUPPORTED)
    *   [NONCE_DUPLICATE](https://developer.kayako.com/api/v1/reference/errors/NONCE_DUPLICATE)
    *   [ONE_FIELD_EXPECTED](https://developer.kayako.com/api/v1/reference/errors/ONE_FIELD_EXPECTED)
    *   [OTP_EXPECTED](https://developer.kayako.com/api/v1/reference/errors/OTP_EXPECTED)
    *   [PARAMETERS_INCONSISTENT](https://developer.kayako.com/api/v1/reference/errors/PARAMETERS_INCONSISTENT)
    *   [PARAMETER_INVALID](https://developer.kayako.com/api/v1/reference/errors/PARAMETER_INVALID)
    *   [PASSWORD_POLICY_VIOLATION](https://developer.kayako.com/api/v1/reference/errors/PASSWORD_POLICY_VIOLATION)
    *   [PERMISSIONS_DENIED](https://developer.kayako.com/api/v1/reference/errors/PERMISSIONS_DENIED)
    *   [PORTAL_NOT_SUPPORTED](https://developer.kayako.com/api/v1/reference/errors/PORTAL_NOT_SUPPORTED)
    *   [RATE_LIMIT_REACHED](https://developer.kayako.com/api/v1/reference/errors/RATE_LIMIT_REACHED)
    *   [REQUEST_FIELDS_EMPTY](https://developer.kayako.com/api/v1/reference/errors/REQUEST_FIELDS_EMPTY)
    *   [RESOURCES_DO_NOT_MATCH](https://developer.kayako.com/api/v1/reference/errors/RESOURCES_DO_NOT_MATCH)
    *   [RESOURCE_ACTION_NOT_AVAILABLE](https://developer.kayako.com/api/v1/reference/errors/RESOURCE_ACTION_NOT_AVAILABLE)
    *   [RESOURCE_EXISTS](https://developer.kayako.com/api/v1/reference/errors/RESOURCE_EXISTS)
    *   [RESOURCE_GONE](https://developer.kayako.com/api/v1/reference/errors/RESOURCE_GONE)
    *   [RESOURCE_MODIFIED](https://developer.kayako.com/api/v1/reference/errors/RESOURCE_MODIFIED)
    *   [RESOURCE_NOT_AVAILABLE](https://developer.kayako.com/api/v1/reference/errors/RESOURCE_NOT_AVAILABLE)
    *   [RESOURCE_NOT_FOUND](https://developer.kayako.com/api/v1/reference/errors/RESOURCE_NOT_FOUND)
    *   [SESSION_CREATION_FAILED](https://developer.kayako.com/api/v1/reference/errors/SESSION_CREATION_FAILED)
    *   [SESSION_LOADING_FAILED](https://developer.kayako.com/api/v1/reference/errors/SESSION_LOADING_FAILED)
    *   [TIMESTAMP_MISMATCH](https://developer.kayako.com/api/v1/reference/errors/TIMESTAMP_MISMATCH)
    *   [TIMESTAMP_MISSING](https://developer.kayako.com/api/v1/reference/errors/TIMESTAMP_MISSING)
    *   [URL_ARGUMENT_REDUNDANT](https://developer.kayako.com/api/v1/reference/errors/URL_ARGUMENT_REDUNDANT)
    *   [URL_ARGUMENT_REQUIRED](https://developer.kayako.com/api/v1/reference/errors/URL_ARGUMENT_REQUIRED)
    *   [URL_RESOURCE_MISSING](https://developer.kayako.com/api/v1/reference/errors/URL_RESOURCE_MISSING)
    *   [URL_TOO_MANY_SEGMENTS](https://developer.kayako.com/api/v1/reference/errors/URL_TOO_MANY_SEGMENTS)
    *   [URL_VERSION_MISSING](https://developer.kayako.com/api/v1/reference/errors/URL_VERSION_MISSING)
    *   [VERSION_NOT_SUPPORTED](https://developer.kayako.com/api/v1/reference/errors/VERSION_NOT_SUPPORTED)

*   [Preferences](https://developer.kayako.com/private/v1/notifications/preferences/private/v1/notifications/preferences)

1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   REFERENCE

# Data Types

Here is the list of basic data types mentioned in the API documentation:

### String

Specified "as-is" in responses and requests.

### Integer

Specified as a sequence of digits optionally prefixed with `−`, in responses and requests.

### Float

Specified as a sequence of digits separated by `.` and optionally prefixed with `-`, in responses and requests.

### Timestamp

In responses dates are returned in the [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) format.

In requests you can use:

*   The [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) format, e.g.: `2015-09-08T01:55:28+05:00`
*   The [Unix time](https://en.wikipedia.org/wiki/Unix_time) format, e.g.: `1441828693`

### Boolean

Booleans are represented as `true` or `false` in responses.

In requests in addition to case-insensitive `true` and `false` you can use integers `1` and `0`.

### Binary

Binary data are to be [base64-encoded](https://en.wikipedia.org/wiki/Base64), in responses and requests.

### Option

Options are returned as upper-case strings in responses.

In requests they are case-insensitive.

### Array

Responses use JSON to represent arrays.

In requests you can use the following formats:

*   JSON array, if you use the JSON request format, e.g.: `"numbers": [1, 2, 3]`
*   The field name plus `[]`, e.g.: `numbers[]=1&numbers[]=2&numbers[]=3`
*   Comma-separated values (if values do not contain special symbols), e.g.: `numbers=1,2,3`

 Copyright © 2018 [Kayako](http://www.kayako.com/). All rights reserved • [Privacy Policy](http://www.kayako.com/about/privacy)

[](https://www.facebook.com/kayako/)[](https://twitter.com/kayako)




### Partial Output

Title: Partial Output - Reference | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/reference/partial_output/

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   REFERENCE

Many resources have many fields and nested resources, which in turn also have many fields and nested resources, and so on. This can make a response body huge.

To address this issue Kayako offers the following two solutions:

*   Control, which types of resources will be included into the response.
*   Control, which resource fields at which path will be included into the response.

## By resource types

Kayako API service allows to specify, which types of resources should be included into the response. This can be controlled by the `include` argument, that should contain the comma-separated list of resource types.

The resource type is what is specified in the `resource_type` field of the resource, e.g, `user`, `case`.

### The include argument

By default, the API service includes only _references_ to nested resources, i.e., includes only `id` and `resource_type` fields of resources, e.g.:

```
"creator": {
    "id": 1,
    "resource_type": "user"
}
```

To include all nested resources (instead of just their references) set `include` to `*` (all types).

To include only certain types of resources, list these types in the `include` argument (separate by commas), e.g.:

```
?include=user,case
```

## By resource fields

Kayako API service allows to control, which resource fields should be included into the response. This can be done by specifying field names in the `fields` argument.

### Field categories

Resource fields in Kayako API fall into three categories:

*   Fields, that are always returned (like `id`).
*   Fields, that are returned by **default**.
*   Fields, that are not returned by default.

There are also hidden fields, which are never returned (used only to set values - e.g. `password`).

### The fields argument

To control, which fields should be returned in the response body, you can use the `fields` argument. In this argument you can specify the comma-separated list of field names, which can be prepended with optional modifiers.

#### Modifiers

The following modifiers are supported:

*   `+` instructs to include the field name into the response
*   `-` instructs to exclude the field name from the response

Example:

```
?fields=+full_name,-designation
```

#### Nested fields

To control fields of a nested resource specify corresponding rules in parentheses after the name of the field, that holds the nested resource, e.g.:

```
?fields=+role(+title,-type)
```

Certainly, to be able to control, which fields of nested resources should be included into the response, you must include these resources into the response by listing their types in the `include` argument.

#### Default display

The `+` modifier in display rules is actually optional and can be omitted, but this will change the default inclusion policy of the resource's fields.

Thus, if a field, that should be returned by default, is specified in display rules without the `+` modifier, all other **default** fields will no more be returned by default.

Thus:

*   `fields=title` will return only `id`, and `title`.
*   `fields=+title` will return `id`, `title` and other fields, that should be returned by default.
*   `fields=ip_restriction` will return `id`, `title`, other default fields and the `ip_restriction` field.

Here `title` is a field, that is shown by default, and `ip_restriction` is a field, that is omitted by default.

#### Wildcard for all fields

You can also request to return **all** available fields of the resource by specifying `*` as the field name.

Examples: `fields=*`, `fields=role(*)`

This, however, won't affect fields of nested resources.

The special rule `fields=*(*)` can also be used to request **all** fields of **all** nested resources at any nesting level.




### Pagination

Title: Pagination - Reference | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/reference/pagination/

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   REFERENCE

By default the API returns first 10 items of the collection. This can be changed with the `limit` argument.

To navigate through "pages" of the collection you can use the following pagination styles:

## [](https://developer.kayako.com/api/v1/reference/pagination/#offset-based-1)Offset-based

It's the default pagination style, which is supported by **all** resources.

The current position in the collection is controlled by the special `offset` argument. Like in arrays the offset starts at `0` (the default offset) and ends at the total count - 1.

Example:

| Page | Arguments |
| --- | --- |
| 1st | `offset=0&limit=25` |
| 2nd | `offset=25&limit=25` |
| 3rd | `offset=50&limit=25` |

Consider using the `If-Match` HTTP header to ensure, that the collection you browse was not changed. See also [Caching](https://developer.kayako.com/api/v1/reference/caching/).

## [](https://developer.kayako.com/api/v1/reference/pagination/#cursor-based-2)Cursor-based

The cursor-based pagination helps to ensure, that new or removed items won't shift your position in the collection. However, **not** all resources support this pagination style.

Each item of a collection has an ID, which can be used to determine the position in the collection.

![Image 1](https://developer.kayako.com/assets/api/pagination/cursor-collection.png)

Here (assuming `limit=10`):

*   `before_id=15` will return ID#43 - ID#19 and is same as `offset=0`
*   `after_id=19` will return ID#15 - ID#5 and is same as `offset=10`

Also note, that if the collection gets new items:

![Image 2](https://developer.kayako.com/assets/api/pagination/cursor-new-items.png)

The `before_id=15` will still return ID#43 - ID#19.

Same if the item with ID#15 will be removed (`before_id` does not require the item with the ID to exist).

Resources, that support the cursor-based pagination, are ordered by ID, ascending or descending.

The `before_id` and `after_id` arguments consider the position of the item in the collection from the start, and **not** the numeric value of the ID.

Also, unlike the offset-based pagination, for which we can just decrement or increment the offset value to retrieve previous and next pages accordingly, for the cursor-based pagination we can determine only the very previous and next pages, as they are relative to the current one (thus, for `before_id` we use the ID of the first item on the page and for `after_id` we use the ID of the last one).

Luckily, for **some** resources the API response includes links to the first and last page of the collection:

## [](https://developer.kayako.com/api/v1/reference/pagination/#date-based-3)Date-based

The date-based pagination is useful when you want to "follow" the collection (e.g., to retrieve new items). However, **not** all resources support this pagination style.

Many resources have a timestamp field, that holds a distinct date of the resource. Such field can be used to determine the position of the resource in the collection.

![Image 3](https://developer.kayako.com/assets/api/pagination/date-collection.png)

Here (assuming `limit=10`):

*   `since=2015-08-28T20:34:59+05:00` will return ID#45 - ID#28 and is same as `offset=0`
*   `until=2015-08-30T16:58:07+05:00` will return ID#22 - ID#16 and is same as `offset=10`

Resources, that support the date-based pagination, are ordered by the date, ascending or descending.

Unlike arguments of the the cursor-based pagination `since` and `until` arguments consider the numeric value of the date - **not** offset from the start of the collection.

Like arguments of the the cursor-based pagination `since` and `until` arguments do **not** require an item with the referenced date to exist.

A resource supports either the cursor-based padination or the date-based one - **never** both.

Note, that taking the example above it's also easy to get new items of the collection just by using `since=2015-08-31T12:45:30+05:00`.

Like the cursor-based pagination the date-based one is also resistant to addition and/or removal of the collection's items.

Also, like for the cursor-based pagination we can determine only the very previous and next pages of the collection (we can use the date of the first item of the current page for `since` or `until` (depends on the order) and the date of the last item of the page for `until` or `since`).

To help here **some** resources include links to the first and last page of the collection into the response.

_Important:_ The date of the resource in the collection is **not** always unique, what means that the API client **must** be ready, that the collection may contain more items than requested (by the `limit` argument).




### File Upload

Title: File Upload - Reference | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/reference/file_upload/

Markdown Content:
Contents

*   [1 Two-step upload](https://developer.kayako.com/api/v1/reference/file_upload/#two-step-upload-1)

    *   [1.1 Upload to File resource](https://developer.kayako.com/api/v1/reference/file_upload/#upload-to-file-resource-1.1)
    *   [1.2 Associate file with resource](https://developer.kayako.com/api/v1/reference/file_upload/#associate-file-with-resource-1.2)

*   [2 Single-step upload](https://developer.kayako.com/api/v1/reference/file_upload/#single-step-upload-2)

    *   [2.1 Upload file content as request body](https://developer.kayako.com/api/v1/reference/file_upload/#upload-file-content-as-request-body-2.1)

    
        *   [2.1.1 File name](https://developer.kayako.com/api/v1/reference/file_upload/#file-name-2.1.1)
        *   [2.1.2 Field name](https://developer.kayako.com/api/v1/reference/file_upload/#field-name-2.1.2)
        *   [2.1.3 File size](https://developer.kayako.com/api/v1/reference/file_upload/#file-size-2.1.3)
        *   [2.1.4 Checksum](https://developer.kayako.com/api/v1/reference/file_upload/#checksum-2.1.4)
        *   [2.1.5 Complete example](https://developer.kayako.com/api/v1/reference/file_upload/#complete-example-2.1.5)

        
            *   [2.1.5.1 CURL](https://developer.kayako.com/api/v1/reference/file_upload/#curl-2.1.5.1)

    *   [2.2 Using multi-part form data](https://developer.kayako.com/api/v1/reference/file_upload/#using-multi-part-form-data-2.2)

    
        *   [2.2.1 Complete example](https://developer.kayako.com/api/v1/reference/file_upload/#complete-example-2.2.1)

        
            *   [2.2.1.1 CURL](https://developer.kayako.com/api/v1/reference/file_upload/#curl-2.2.1.1)

In order to make file uploading as easy and flexible as possible we support several scenarios for this procedure.

## [](https://developer.kayako.com/api/v1/reference/file_upload/#two-step-upload-1)Two-step upload

With [Files API](https://developer.kayako.com/api/v1/general/files) you can first upload files separately and then "attach" them to appropriate resources.

Resources, that support this scenario, declare special `File` resource handling fields, that end with `_file_id` (for single file) or with `_file_ids` (for multiple files).

With this scenario you can also re-use uploaded files (i.e. "attach" the same file to different resources).

### [](https://developer.kayako.com/api/v1/reference/file_upload/#upload-to-file-resource-1.1)Upload to File resource

During the first step you upload files to the `File` resource using the `POST` HTTP method as described [here](https://developer.kayako.com/api/v1/general/files#Add-a-file).

```
POST /api/v1/files.json HTTP/1.1
Host: brewfictus.kayako.com
Content-Disposition: attachment; filename="coffee.png"
Content-Length: 2347
Content-Type: image/png

...
```

_This is, in fact, the single-step upload to the `File` resource._

### [](https://developer.kayako.com/api/v1/reference/file_upload/#associate-file-with-resource-1.2)Associate file with resource

For each uploaded file [Files API](https://developer.kayako.com/api/v1/general/files) generates unique ID, that can be used to associate the file with a resource during the second step. To do this pass the ID as a value for a resource's file handling field.

```
PUT /api/v1/profile.json HTTP/1.1
Host: brewfictus.kayako.com
Content-Type: application/x-www-form-urlencoded
Content-Length: 17

avatar_file_id=19
```

## [](https://developer.kayako.com/api/v1/reference/file_upload/#single-step-upload-2)Single-step upload

The single-step upload technique is used to upload files to resources directly.

### [](https://developer.kayako.com/api/v1/reference/file_upload/#upload-file-content-as-request-body-2.1)Upload file content as request body

This is the simplest uploading technique from the low-level technical perspective.

To upload a file you can just pass its contents as the request body.

#### [](https://developer.kayako.com/api/v1/reference/file_upload/#file-name-2.1.1)File name

To specify the name of the uploaded file (required in most cases) use the `Content-Desposition` HTTP header:

```
POST /api/v1/files.json HTTP/1.1
Host: brewfictus.kayako.com
Content-Disposition: attachment; filename="coffee.png"
```

Alternatively, you can use the `_filename` argument:

```
/api/v1/files.json?_filename=coffee.png
```

#### [](https://developer.kayako.com/api/v1/reference/file_upload/#field-name-2.1.2)Field name

If the API end point expects a field name for the uploaded file (e.g. if multiple target fields are supported) use the `Content-Desposition` HTTP header as follows:

```
POST /api/v1/files.json HTTP/1.1
Host: brewfictus.kayako.com
Content-Disposition: attachment; name="avatar"; filename="coffee.png"
```

Alternatively, you can use the `_field` argument:

```
/api/v1/files.json?_field=avatar&_filename=coffee.png
```

#### [](https://developer.kayako.com/api/v1/reference/file_upload/#file-size-2.1.3)File size

We strongly recommend to always specify the file size in the `Content-Length` HTTP header of the request.

This way you also ensure that an incomplete file won't be accepted by the server.

#### [](https://developer.kayako.com/api/v1/reference/file_upload/#checksum-2.1.4)Checksum

To ensure, that content of the file was not damaged during the network transfer include the `Content-MD5` header with the MD5 hash of the file into your request:

```
POST /api/v1/files.json HTTP/1.1
Host: brewfictus.kayako.com
Content-MD5: f9e590b40fe31ecd4e0c4fc3f3c0b9fd
```

Alternatively, you can use the `_md5` argument:

```
/api/v1/files.json?_md5=f9e590b40fe31ecd4e0c4fc3f3c0b9fd
```

#### [](https://developer.kayako.com/api/v1/reference/file_upload/#complete-example-2.1.5)Complete example

Here is the complete example of the request headers, which can be used for uploading files using this technique:

```
POST /api/v1/files.json HTTP/1.1
Host: brewfictus.kayako.com
Content-Disposition: attachment; name="avatar"; filename="coffee.png"
Content-MD5: f9e590b40fe31ecd4e0c4fc3f3c0b9fd
Content-Length: 2347
Content-Type: image/png

...
```

##### [](https://developer.kayako.com/api/v1/reference/file_upload/#curl-2.1.5.1)CURL

Here is the example of the CURL command used for uploading files with this technique.

By default CURL always adds `Content-Type: application/x-www-form-urlencoded`, what makes the API server think, that the body contains parameters. So, to upload files as the body always specify the Content-Type, e.g. `application/octet-stream`.

The special CURL file uploading mode is also supported:

### [](https://developer.kayako.com/api/v1/reference/file_upload/#using-multi-part-form-data-2.2)Using multi-part form data

This is the most commonly used uploading technique, which is used by web browsers to upload files to HTTP servers by default. This is also the only technique, that allows to upload files and to send parameters in a single request body. Additionally, this technique can be used to upload multiple files at once.

This technique is identified by the `Content-Type` HTTP request header, which must be set to `multipart/form-data`.

```
POST /api/v1/files.json HTTP/1.1
Host: brewfictus.kayako.com
Content-Type: multipart/form-data; boundary="1modcYGLAATJpapo8jhD4UwHbF5asu4u"
```

Here, the boundary is a special unique string, that is used to split the request body into "parts".

The request body and each its part must start with the special line:

```
--<boundary>
```

The last line of the request body must be:

```
--<boundary>--
```

Like a HTTP request each part of the multi-part request must start with HTTP headers, that describe this part, following by an empty line and the contents.

The following HTTP headers are supported for parts of the multi-part request:

*   `Content-Disposition` is **required** and must be set to `form-data`. Additionally, it may include the `name` (field name) and the `filename`.
*   `Content-Length` is strongly recommended and must be set to the size of the content delivered inside the part.
*   `Content-MD5` can be specified to ensure that data won't be saved in a damaged state.
*   `Content-Type` can be used to specify the MIME type of the file.
*   `Content-Transfer-Encoding` to specify encoding of the content. The `binary` encoding is recommended.

See also [RFC 2388](https://tools.ietf.org/html/rfc2388) for details.

#### [](https://developer.kayako.com/api/v1/reference/file_upload/#complete-example-2.2.1)Complete example

Here is the complete example of the request, that uses this format:

```
POST /api/v1/files.json HTTP/1.1
Host: brewfictus.kayako.com
Content-Type: multipart/form-data; boundary="1modcYGLAATJpapo8jhD4UwHbF5asu4u"

--1modcYGLAATJpapo8jhD4UwHbF5asu4u
Content-Disposition: form-data; filename="coffee.png"
Content-Type: image/png
Content-Transfer-Encoding: binary

...
--1modcYGLAATJpapo8jhD4UwHbF5asu4u
Content-Disposition: form-data; filename="cappuccino.png"
Content-Type: image/png
Content-Transfer-Encoding: binary

...
--1modcYGLAATJpapo8jhD4UwHbF5asu4u--
```

##### [](https://developer.kayako.com/api/v1/reference/file_upload/#curl-2.2.1.1)CURL

Here is the example of the CURL command, that uses this format:




### Caching

Title: Caching - Reference | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/reference/caching/

Markdown Content:
Contents

*   [1 ETag response header](https://developer.kayako.com/api/v1/reference/caching/#etag-response-header-1)

    *   [1.1 If-Match request header](https://developer.kayako.com/api/v1/reference/caching/#if-match-request-header-1.1)
    *   [1.2 If-None-Match request header](https://developer.kayako.com/api/v1/reference/caching/#if-none-match-request-header-1.2)

*   [2 Last-Modified response header](https://developer.kayako.com/api/v1/reference/caching/#last-modified-response-header-2)

    *   [2.1 If-Modified-Since request header](https://developer.kayako.com/api/v1/reference/caching/#if-modified-since-request-header-2.1)
    *   [2.2 If-Unmodified-Since request header](https://developer.kayako.com/api/v1/reference/caching/#if-unmodified-since-request-header-2.2)

*   [3 AJAX Caching Mode](https://developer.kayako.com/api/v1/reference/caching/#ajax-caching-mode-3)

We strongly advise you to implement caching in your API client.

Caching does not only allow to reduce network load, but it also:

*   Helps to ensure that the resource you work with has not been modified by others
*   Allows to fetch only new or updated resources
*   Reduces load of our API service this way protecting its quality

These makes caching implementation significant for API clients.

An API response can include the `ETag` HTTP header holding the hash of the resource or collection that comes with the response:

```
HTTP/1.1 200 OK
Content-Type: application/json
ETag: 1653fb55ce4603b2f3def1903eb81333
X-API-Version: 1
```

In our API service the value of the `ETag` HTTP header represents the **state** of the delivered resource itself, i.e. does not include nested resources. This means that for the collection it considers only IDs of contained resources.

To ensure that you work with the same version of the resource include the `If-Match` HTTP header with the ETag value into your API request:

In this case the action will be performed only if the specified hash matches the resource's current hash, i.e. if the resource has not been modified.

Otherwise, the API service will return the `RESOURCE_MODIFIED` error with the **412** (Precondition Failed) HTTP status code.

Consider always using the `If-Match` or the `If-Unmodified-Since` HTTP header with `PUT` and `DELETE` requests.

To retrieve a resource only if it has been modified include the `If-None-Match` HTTP header with the ETag value into your API request:

```
GET /api/v1/base/user/1 HTTP/1.1
Host: brewfictus.kayako.com
If-None-Match: 1653fb55ce4603b2f3def1903eb81333
```

If the resource was not modified the API service will return the **304** (Not Modified) HTTP status code (with no body).

Consider always using the `If-None-Match` or the `If-Modified-Since` HTTP header with `GET` requests to enable client-side caching.

An API response can include the `Last-Modified` HTTP header holding the date when the resource or collection was modified last time:

```
HTTP/1.1 200 OK
Content-Type: application/json
Last-Modified: Fri, 14 Aug 2015 18:39:41 +0000
X-API-Version: 1
```

To retrieve a resource only if it has been modified since the last time you saw it include the `If-Modified-Since` HTTP header with the appropriate value into your API request:

```
GET /api/v1/base/user/1 HTTP/1.1
Host: brewfictus.kayako.com
If-Modified-Since: Fri, 14 Aug 2015 18:39:41 +0000
```

If the resource was not modified the API service will return the **304** (Not Modified) HTTP status code (with no body).

Consider always using the `If-Modified-Since` or the `If-None-Match` HTTP header with `GET` requests to enable client-side caching.

To ensure that the resource was not modified since the last time you saw it include the `If-Unmodified-Since` HTTP header with the appropriate value into your API request:

```
PUT /api/v1/base/user/1 HTTP/1.1
Host: brewfictus.kayako.com
If-Unmodified-Since: Fri, 14 Aug 2015 18:39:41 +0000
```

If the resource was modified the API service will return the `RESOURCE_MODIFIED` error with the **412** (Precondition Failed) HTTP status code.

Consider always using the `If-Unmodified-Since` or the `If-Match` HTTP header with `PUT` and `DELETE` requests.

## [](https://developer.kayako.com/api/v1/reference/caching/#ajax-caching-mode-3)AJAX Caching Mode

_The default algorithm of generating values for the `ETag` and the `Last-Modified` headers slightly differs from what is expected by web browsers and proxies. Thus, pure HTTP declares the ETag value as a hash of the content while REST API uses it as a hash of the resource._

As the default caching mode can cause some unexpected behavior of the API when used in a web browser or through a HTTP proxy we introduced the special AJAX mode.

In the AJAX caching mode values of the `ETag` and the `Last-Modified` HTTP headers represent a version of the content that also includes related resources. Therefore, this mode **should not** be used for the concurrency control.

The AJAX caching mode gets enabled when the API request contains the `X-Requested-With` HTTP header with the special value `XMHTTPRequest` (such header and its value is commonly used by web browsers' JavaScript engines).




### Security

Title: Security - Reference | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/reference/security/

Markdown Content:
# Security - Reference | Kayako Developers

[![Image 1](https://developer.kayako.com/img/kayako-logo.png)](https://developer.kayako.com/)

*     
*   [Docs](https://developer.kayako.com/docs/single_sign_on/introduction/)
*   [API](https://developer.kayako.com/api/v1/reference/introduction/)
*   [SDK](https://developer.kayako.com/sdk/java/integration_guide/)
*   [Messenger![Image 2: beta](https://developer.kayako.com/img/new.png)](https://developer.kayako.com/messenger/home/)

*     
*   [Docs](https://developer.kayako.com/docs/single_sign_on/introduction/)
*   [API](https://developer.kayako.com/api/v1/reference/introduction/)
*   [SDK](https://developer.kayako.com/sdk/java/integration_guide/)
*   [Messenger![Image 3: beta](https://developer.kayako.com/img/new.png)](https://developer.kayako.com/messenger/home/)

Reference

*   [Reference](https://developer.kayako.com/api/v1/reference/introduction/)
Core*   [Users](https://developer.kayako.com/api/v1/users/activities/)
*   [Cases](https://developer.kayako.com/api/v1/cases/activities/)
*   [Insights](https://developer.kayako.com/api/v1/insights/cases/)
*   [Search](https://developer.kayako.com/api/v1/search/search/)
*   [Automation](https://developer.kayako.com/api/v1/automation/endpoints/)
Channels*   [Twitter](https://developer.kayako.com/api/v1/twitter/accounts/)
*   [Facebook](https://developer.kayako.com/api/v1/facebook/accounts/)
*   [Mail](https://developer.kayako.com/api/v1/mail/mailboxes/)
*   [Event](https://developer.kayako.com/api/v1/event/events/)
*   [Help Center](https://developer.kayako.com/api/v1/help_center/articles/)
Others*   [General](https://developer.kayako.com/api/v1/general/autocomplete/)

*   [Introduction](https://developer.kayako.com/api/v1/reference/introduction/)
*   [Authentication](https://developer.kayako.com/api/v1/reference/authentication/)
*   [Request](https://developer.kayako.com/api/v1/reference/request/)
*   [Response](https://developer.kayako.com/api/v1/reference/response/)
*   [Data Types](https://developer.kayako.com/api/v1/reference/data_types/)
*   [Partial Output](https://developer.kayako.com/api/v1/reference/partial_output/)
*   [Pagination](https://developer.kayako.com/api/v1/reference/pagination/)
*   [File Upload](https://developer.kayako.com/api/v1/reference/file_upload/)
*   [Caching](https://developer.kayako.com/api/v1/reference/caching/)
*   [Security](https://developer.kayako.com/api/v1/reference/security/)
*   [Rate Limiting](https://developer.kayako.com/api/v1/reference/rate_limiting/)
*   [Special Options](https://developer.kayako.com/api/v1/reference/special_options/)
*   [Using Javascript](https://developer.kayako.com/api/v1/reference/using_javascript/)
*   [Errors](https://developer.kayako.com/api/v1/reference/security/)
    *   [ACTION_FAILED](https://developer.kayako.com/api/v1/reference/errors/ACTION_FAILED)
    *   [ANY_FIELD_REQUIRED](https://developer.kayako.com/api/v1/reference/errors/ANY_FIELD_REQUIRED)
    *   [APP_NOT_FOUND](https://developer.kayako.com/api/v1/reference/errors/APP_NOT_FOUND)
    *   [APP_REST_NOT_AVAILABLE](https://developer.kayako.com/api/v1/reference/errors/APP_REST_NOT_AVAILABLE)
    *   [ASSOCIATE_NOT_FOUND](https://developer.kayako.com/api/v1/reference/errors/ASSOCIATE_NOT_FOUND)
    *   [AUTHENTICATION_FAILED](https://developer.kayako.com/api/v1/reference/errors/AUTHENTICATION_FAILED)
    *   [AUTHENTICATION_LOCKED](https://developer.kayako.com/api/v1/reference/errors/AUTHENTICATION_LOCKED)
    *   [AUTHORIZATION_REQUIRED](https://developer.kayako.com/api/v1/reference/errors/AUTHORIZATION_REQUIRED)
    *   [CHECKSUM_MISMATCH](https://developer.kayako.com/api/v1/reference/errors/CHECKSUM_MISMATCH)
    *   [CONDITION_REQUIRED](https://developer.kayako.com/api/v1/reference/errors/CONDITION_REQUIRED)
    *   [CONTENT_NOT_AVAILABLE](https://developer.kayako.com/api/v1/reference/errors/CONTENT_NOT_AVAILABLE)
    *   [CREDENTIAL_EXPIRED](https://developer.kayako.com/api/v1/reference/errors/CREDENTIAL_EXPIRED)
    *   [CSRF_FAILED](https://developer.kayako.com/api/v1/reference/errors/CSRF_FAILED)
    *   [DELETION_FAILED](https://developer.kayako.com/api/v1/reference/errors/DELETION_FAILED)
    *   [EXCEPTION_CAUGHT](https://developer.kayako.com/api/v1/reference/errors/EXCEPTION_CAUGHT)
    *   [FEATURE_NOT_AVAILABLE](https://developer.kayako.com/api/v1/reference/errors/FEATURE_NOT_AVAILABLE)
    *   [FIELD_DUPLICATE](https://developer.kayako.com/api/v1/reference/errors/FIELD_DUPLICATE)
    *   [FIELD_EMPTY](https://developer.kayako.com/api/v1/reference/errors/FIELD_EMPTY)
    *   [FIELD_INVALID](https://developer.kayako.com/api/v1/reference/errors/FIELD_INVALID)
    *   [FIELD_REQUIRED](https://developer.kayako.com/api/v1/reference/errors/FIELD_REQUIRED)
    *   [FORMAT_NOT_ACCEPTABLE](https://developer.kayako.com/api/v1/reference/errors/FORMAT_NOT_ACCEPTABLE)
    *   [HTTPS_REQUIRED](https://developer.kayako.com/api/v1/reference/errors/HTTPS_REQUIRED)
    *   [LICENSE_EXPIRED](https://developer.kayako.com/api/v1/reference/errors/LICENSE_EXPIRED)
    *   [LICENSE_LIMIT_REACHED](https://developer.kayako.com/api/v1/reference/errors/LICENSE_LIMIT_REACHED)
    *   [METHOD_NOT_SUPPORTED](https://developer.kayako.com/api/v1/reference/errors/METHOD_NOT_SUPPORTED)
    *   [NONCE_DUPLICATE](https://developer.kayako.com/api/v1/reference/errors/NONCE_DUPLICATE)
    *   [ONE_FIELD_EXPECTED](https://developer.kayako.com/api/v1/reference/errors/ONE_FIELD_EXPECTED)
    *   [OTP_EXPECTED](https://developer.kayako.com/api/v1/reference/errors/OTP_EXPECTED)
    *   [PARAMETERS_INCONSISTENT](https://developer.kayako.com/api/v1/reference/errors/PARAMETERS_INCONSISTENT)
    *   [PARAMETER_INVALID](https://developer.kayako.com/api/v1/reference/errors/PARAMETER_INVALID)
    *   [PASSWORD_POLICY_VIOLATION](https://developer.kayako.com/api/v1/reference/errors/PASSWORD_POLICY_VIOLATION)
    *   [PERMISSIONS_DENIED](https://developer.kayako.com/api/v1/reference/errors/PERMISSIONS_DENIED)
    *   [PORTAL_NOT_SUPPORTED](https://developer.kayako.com/api/v1/reference/errors/PORTAL_NOT_SUPPORTED)
    *   [RATE_LIMIT_REACHED](https://developer.kayako.com/api/v1/reference/errors/RATE_LIMIT_REACHED)
    *   [REQUEST_FIELDS_EMPTY](https://developer.kayako.com/api/v1/reference/errors/REQUEST_FIELDS_EMPTY)
    *   [RESOURCES_DO_NOT_MATCH](https://developer.kayako.com/api/v1/reference/errors/RESOURCES_DO_NOT_MATCH)
    *   [RESOURCE_ACTION_NOT_AVAILABLE](https://developer.kayako.com/api/v1/reference/errors/RESOURCE_ACTION_NOT_AVAILABLE)
    *   [RESOURCE_EXISTS](https://developer.kayako.com/api/v1/reference/errors/RESOURCE_EXISTS)
    *   [RESOURCE_GONE](https://developer.kayako.com/api/v1/reference/errors/RESOURCE_GONE)
    *   [RESOURCE_MODIFIED](https://developer.kayako.com/api/v1/reference/errors/RESOURCE_MODIFIED)
    *   [RESOURCE_NOT_AVAILABLE](https://developer.kayako.com/api/v1/reference/errors/RESOURCE_NOT_AVAILABLE)
    *   [RESOURCE_NOT_FOUND](https://developer.kayako.com/api/v1/reference/errors/RESOURCE_NOT_FOUND)
    *   [SESSION_CREATION_FAILED](https://developer.kayako.com/api/v1/reference/errors/SESSION_CREATION_FAILED)
    *   [SESSION_LOADING_FAILED](https://developer.kayako.com/api/v1/reference/errors/SESSION_LOADING_FAILED)
    *   [TIMESTAMP_MISMATCH](https://developer.kayako.com/api/v1/reference/errors/TIMESTAMP_MISMATCH)
    *   [TIMESTAMP_MISSING](https://developer.kayako.com/api/v1/reference/errors/TIMESTAMP_MISSING)
    *   [URL_ARGUMENT_REDUNDANT](https://developer.kayako.com/api/v1/reference/errors/URL_ARGUMENT_REDUNDANT)
    *   [URL_ARGUMENT_REQUIRED](https://developer.kayako.com/api/v1/reference/errors/URL_ARGUMENT_REQUIRED)
    *   [URL_RESOURCE_MISSING](https://developer.kayako.com/api/v1/reference/errors/URL_RESOURCE_MISSING)
    *   [URL_TOO_MANY_SEGMENTS](https://developer.kayako.com/api/v1/reference/errors/URL_TOO_MANY_SEGMENTS)
    *   [URL_VERSION_MISSING](https://developer.kayako.com/api/v1/reference/errors/URL_VERSION_MISSING)
    *   [VERSION_NOT_SUPPORTED](https://developer.kayako.com/api/v1/reference/errors/VERSION_NOT_SUPPORTED)

*   [Preferences](https://developer.kayako.com/private/v1/notifications/preferences/private/v1/notifications/preferences)

1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   REFERENCE

# Security

Contents

*   [1 CSRF protection](https://developer.kayako.com/api/v1/reference/security/#csrf-protection-1)

    *   [1.1 Use protected sessions](https://developer.kayako.com/api/v1/reference/security/#use-protected-sessions-1.1)
    *   [1.2 Protect API requests](https://developer.kayako.com/api/v1/reference/security/#protect-api-requests-1.2)
    *   [1.3 Disable CSRF protection](https://developer.kayako.com/api/v1/reference/security/#disable-csrf-protection-1.3)

*   [2 JavaScript](https://developer.kayako.com/api/v1/reference/security/#javascript-2)

1.   When using [OAuth 2.0](https://developer.kayako.com/api/v1/reference/authentication/#oauth-2-0-1.2), be sure to keep the OAuth secret safe.
2.   Avoid using [Basic HTTP authentication](https://developer.kayako.com/api/v1/reference/authentication/#basic-http-authentication-1.1) scheme, when possible.

## [](https://developer.kayako.com/api/v1/reference/security/#csrf-protection-1)CSRF protection

By default, each API session is protected with the CSRF token.

You can read more about CSRF [here](https://en.wikipedia.org/wiki/Cross-site_request_forgery).

### [](https://developer.kayako.com/api/v1/reference/security/#use-protected-sessions-1.1)Use protected sessions

Unless the CSRF protection is explicitly disabled during authentication, the successful authentication response will contain the session token in the `X-CSRF-Token` response header (in addition to the session ID in the response body):

```text
HTTP/1.1 200 OK
Content-Type: application/json
X-CSRF-Token: DBYmfYEjHNzXI1tvnUAbu8xxD9gWH6bnTVTuqj2RAc1w2fuwuOTCK01yFLO3bksYfXAdCzABauGfZChfivS2BHIc0a5r
X-API-Version: 1

{
    "status": 200,
    "session_id": "lNlZU4goODSinE8DkW3PKs79d60c497f0a5c507e897da818682d6cf21321fca5la58k2s8ZxGYYRfjcuAVgRFA"
}
```

The API client must save this token in a secure storage.

### [](https://developer.kayako.com/api/v1/reference/security/#protect-api-requests-1.2)Protect API requests

If the session is protected with the CSRF token, this token should be supplied with every API request. This can be done via the `X-CSRF-Token` request header, as follows:

```text
POST /api/v1/tests.json HTTP/1.1
Host: brewfictus.kayako.com
X-CSRF-Token: DBYmfYEjHNzXI1tvnUAbu8xxD9gWH6bnTVTuqj2RAc1w2fuwuOTCK01yFLO3bksYfXAdCzABauGfZChfivS2BHIc0a5r
```

The CSRF token is required for unsafe HTTP methods `POST`, `PUT` and `DELETE`. So, if it's not supplied, the API service will return the [CSRF_FAILED](https://developer.kayako.com/api/v1/reference/errors/CSRF_FAILED/) error.

### [](https://developer.kayako.com/api/v1/reference/security/#disable-csrf-protection-1.3)Disable CSRF protection

The CSRF protection can be disabled for new sessions by adding the `X-CSRF` header in the authentication request (that creates the session), as follows:

```text
X-CSRF: false
```

## [](https://developer.kayako.com/api/v1/reference/security/#javascript-2)JavaScript

Use [CORS](https://developer.kayako.com/api/v1/reference/using_javascript/#cors-cross-origin-resource-sharing) instead of [JSONP](https://developer.kayako.com/api/v1/reference/using_javascript/#jsonp-json-with-padding) to access the API service from JavaScript, when possible.

 Copyright © 2018 [Kayako](http://www.kayako.com/). All rights reserved • [Privacy Policy](http://www.kayako.com/about/privacy)

[](https://www.facebook.com/kayako/)[](https://twitter.com/kayako)




### Rate Limiting

Title: Rate Limiting - Reference | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/reference/rate_limiting/

Markdown Content:
# Rate Limiting - Reference | Kayako Developers

[![Image 1](https://developer.kayako.com/img/kayako-logo.png)](https://developer.kayako.com/)

*     
*   [Docs](https://developer.kayako.com/docs/single_sign_on/introduction/)
*   [API](https://developer.kayako.com/api/v1/reference/introduction/)
*   [SDK](https://developer.kayako.com/sdk/java/integration_guide/)
*   [Messenger![Image 2: beta](https://developer.kayako.com/img/new.png)](https://developer.kayako.com/messenger/home/)

*     
*   [Docs](https://developer.kayako.com/docs/single_sign_on/introduction/)
*   [API](https://developer.kayako.com/api/v1/reference/introduction/)
*   [SDK](https://developer.kayako.com/sdk/java/integration_guide/)
*   [Messenger![Image 3: beta](https://developer.kayako.com/img/new.png)](https://developer.kayako.com/messenger/home/)

Reference

*   [Reference](https://developer.kayako.com/api/v1/reference/introduction/)
Core*   [Users](https://developer.kayako.com/api/v1/users/activities/)
*   [Cases](https://developer.kayako.com/api/v1/cases/activities/)
*   [Insights](https://developer.kayako.com/api/v1/insights/cases/)
*   [Search](https://developer.kayako.com/api/v1/search/search/)
*   [Automation](https://developer.kayako.com/api/v1/automation/endpoints/)
Channels*   [Twitter](https://developer.kayako.com/api/v1/twitter/accounts/)
*   [Facebook](https://developer.kayako.com/api/v1/facebook/accounts/)
*   [Mail](https://developer.kayako.com/api/v1/mail/mailboxes/)
*   [Event](https://developer.kayako.com/api/v1/event/events/)
*   [Help Center](https://developer.kayako.com/api/v1/help_center/articles/)
Others*   [General](https://developer.kayako.com/api/v1/general/autocomplete/)

*   [Introduction](https://developer.kayako.com/api/v1/reference/introduction/)
*   [Authentication](https://developer.kayako.com/api/v1/reference/authentication/)
*   [Request](https://developer.kayako.com/api/v1/reference/request/)
*   [Response](https://developer.kayako.com/api/v1/reference/response/)
*   [Data Types](https://developer.kayako.com/api/v1/reference/data_types/)
*   [Partial Output](https://developer.kayako.com/api/v1/reference/partial_output/)
*   [Pagination](https://developer.kayako.com/api/v1/reference/pagination/)
*   [File Upload](https://developer.kayako.com/api/v1/reference/file_upload/)
*   [Caching](https://developer.kayako.com/api/v1/reference/caching/)
*   [Security](https://developer.kayako.com/api/v1/reference/security/)
*   [Rate Limiting](https://developer.kayako.com/api/v1/reference/rate_limiting/)
*   [Special Options](https://developer.kayako.com/api/v1/reference/special_options/)
*   [Using Javascript](https://developer.kayako.com/api/v1/reference/using_javascript/)
*   [Errors](https://developer.kayako.com/api/v1/reference/rate_limiting/)
    *   [ACTION_FAILED](https://developer.kayako.com/api/v1/reference/errors/ACTION_FAILED)
    *   [ANY_FIELD_REQUIRED](https://developer.kayako.com/api/v1/reference/errors/ANY_FIELD_REQUIRED)
    *   [APP_NOT_FOUND](https://developer.kayako.com/api/v1/reference/errors/APP_NOT_FOUND)
    *   [APP_REST_NOT_AVAILABLE](https://developer.kayako.com/api/v1/reference/errors/APP_REST_NOT_AVAILABLE)
    *   [ASSOCIATE_NOT_FOUND](https://developer.kayako.com/api/v1/reference/errors/ASSOCIATE_NOT_FOUND)
    *   [AUTHENTICATION_FAILED](https://developer.kayako.com/api/v1/reference/errors/AUTHENTICATION_FAILED)
    *   [AUTHENTICATION_LOCKED](https://developer.kayako.com/api/v1/reference/errors/AUTHENTICATION_LOCKED)
    *   [AUTHORIZATION_REQUIRED](https://developer.kayako.com/api/v1/reference/errors/AUTHORIZATION_REQUIRED)
    *   [CHECKSUM_MISMATCH](https://developer.kayako.com/api/v1/reference/errors/CHECKSUM_MISMATCH)
    *   [CONDITION_REQUIRED](https://developer.kayako.com/api/v1/reference/errors/CONDITION_REQUIRED)
    *   [CONTENT_NOT_AVAILABLE](https://developer.kayako.com/api/v1/reference/errors/CONTENT_NOT_AVAILABLE)
    *   [CREDENTIAL_EXPIRED](https://developer.kayako.com/api/v1/reference/errors/CREDENTIAL_EXPIRED)
    *   [CSRF_FAILED](https://developer.kayako.com/api/v1/reference/errors/CSRF_FAILED)
    *   [DELETION_FAILED](https://developer.kayako.com/api/v1/reference/errors/DELETION_FAILED)
    *   [EXCEPTION_CAUGHT](https://developer.kayako.com/api/v1/reference/errors/EXCEPTION_CAUGHT)
    *   [FEATURE_NOT_AVAILABLE](https://developer.kayako.com/api/v1/reference/errors/FEATURE_NOT_AVAILABLE)
    *   [FIELD_DUPLICATE](https://developer.kayako.com/api/v1/reference/errors/FIELD_DUPLICATE)
    *   [FIELD_EMPTY](https://developer.kayako.com/api/v1/reference/errors/FIELD_EMPTY)
    *   [FIELD_INVALID](https://developer.kayako.com/api/v1/reference/errors/FIELD_INVALID)
    *   [FIELD_REQUIRED](https://developer.kayako.com/api/v1/reference/errors/FIELD_REQUIRED)
    *   [FORMAT_NOT_ACCEPTABLE](https://developer.kayako.com/api/v1/reference/errors/FORMAT_NOT_ACCEPTABLE)
    *   [HTTPS_REQUIRED](https://developer.kayako.com/api/v1/reference/errors/HTTPS_REQUIRED)
    *   [LICENSE_EXPIRED](https://developer.kayako.com/api/v1/reference/errors/LICENSE_EXPIRED)
    *   [LICENSE_LIMIT_REACHED](https://developer.kayako.com/api/v1/reference/errors/LICENSE_LIMIT_REACHED)
    *   [METHOD_NOT_SUPPORTED](https://developer.kayako.com/api/v1/reference/errors/METHOD_NOT_SUPPORTED)
    *   [NONCE_DUPLICATE](https://developer.kayako.com/api/v1/reference/errors/NONCE_DUPLICATE)
    *   [ONE_FIELD_EXPECTED](https://developer.kayako.com/api/v1/reference/errors/ONE_FIELD_EXPECTED)
    *   [OTP_EXPECTED](https://developer.kayako.com/api/v1/reference/errors/OTP_EXPECTED)
    *   [PARAMETERS_INCONSISTENT](https://developer.kayako.com/api/v1/reference/errors/PARAMETERS_INCONSISTENT)
    *   [PARAMETER_INVALID](https://developer.kayako.com/api/v1/reference/errors/PARAMETER_INVALID)
    *   [PASSWORD_POLICY_VIOLATION](https://developer.kayako.com/api/v1/reference/errors/PASSWORD_POLICY_VIOLATION)
    *   [PERMISSIONS_DENIED](https://developer.kayako.com/api/v1/reference/errors/PERMISSIONS_DENIED)
    *   [PORTAL_NOT_SUPPORTED](https://developer.kayako.com/api/v1/reference/errors/PORTAL_NOT_SUPPORTED)
    *   [RATE_LIMIT_REACHED](https://developer.kayako.com/api/v1/reference/errors/RATE_LIMIT_REACHED)
    *   [REQUEST_FIELDS_EMPTY](https://developer.kayako.com/api/v1/reference/errors/REQUEST_FIELDS_EMPTY)
    *   [RESOURCES_DO_NOT_MATCH](https://developer.kayako.com/api/v1/reference/errors/RESOURCES_DO_NOT_MATCH)
    *   [RESOURCE_ACTION_NOT_AVAILABLE](https://developer.kayako.com/api/v1/reference/errors/RESOURCE_ACTION_NOT_AVAILABLE)
    *   [RESOURCE_EXISTS](https://developer.kayako.com/api/v1/reference/errors/RESOURCE_EXISTS)
    *   [RESOURCE_GONE](https://developer.kayako.com/api/v1/reference/errors/RESOURCE_GONE)
    *   [RESOURCE_MODIFIED](https://developer.kayako.com/api/v1/reference/errors/RESOURCE_MODIFIED)
    *   [RESOURCE_NOT_AVAILABLE](https://developer.kayako.com/api/v1/reference/errors/RESOURCE_NOT_AVAILABLE)
    *   [RESOURCE_NOT_FOUND](https://developer.kayako.com/api/v1/reference/errors/RESOURCE_NOT_FOUND)
    *   [SESSION_CREATION_FAILED](https://developer.kayako.com/api/v1/reference/errors/SESSION_CREATION_FAILED)
    *   [SESSION_LOADING_FAILED](https://developer.kayako.com/api/v1/reference/errors/SESSION_LOADING_FAILED)
    *   [TIMESTAMP_MISMATCH](https://developer.kayako.com/api/v1/reference/errors/TIMESTAMP_MISMATCH)
    *   [TIMESTAMP_MISSING](https://developer.kayako.com/api/v1/reference/errors/TIMESTAMP_MISSING)
    *   [URL_ARGUMENT_REDUNDANT](https://developer.kayako.com/api/v1/reference/errors/URL_ARGUMENT_REDUNDANT)
    *   [URL_ARGUMENT_REQUIRED](https://developer.kayako.com/api/v1/reference/errors/URL_ARGUMENT_REQUIRED)
    *   [URL_RESOURCE_MISSING](https://developer.kayako.com/api/v1/reference/errors/URL_RESOURCE_MISSING)
    *   [URL_TOO_MANY_SEGMENTS](https://developer.kayako.com/api/v1/reference/errors/URL_TOO_MANY_SEGMENTS)
    *   [URL_VERSION_MISSING](https://developer.kayako.com/api/v1/reference/errors/URL_VERSION_MISSING)
    *   [VERSION_NOT_SUPPORTED](https://developer.kayako.com/api/v1/reference/errors/VERSION_NOT_SUPPORTED)

*   [Preferences](https://developer.kayako.com/private/v1/notifications/preferences/private/v1/notifications/preferences)

1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   REFERENCE

# Rate Limiting

To protect the quality of our API service we may enable rate limits for some actions of some API resources.

If you exceed such rate limit you get the HTTP response:

```text
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
Retry-After: 59
X-API-Version: 1

{
    "status": 429,
    "errors": [
        {
            "code": "RATE_LIMIT_REACHED",
            "message": "The rate limit for this action was reached",
            "more_info": "https://developer.kayako.com/api/v1/reference/errors/RATE_LIMIT_REACHED"
        }
    ]
}
```

Such response will always include the `Retry-After` HTTP header holding the number of seconds in which you can send your request again.

API rate limits are defined per minute.

 Copyright © 2018 [Kayako](http://www.kayako.com/). All rights reserved • [Privacy Policy](http://www.kayako.com/about/privacy)

[](https://www.facebook.com/kayako/)[](https://twitter.com/kayako)




### Special Options

Title: Special Options - Reference | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/reference/special_options/

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   REFERENCE

## [](https://developer.kayako.com/api/v1/reference/special_options/#letter-case-1)Letter case

There are different naming conventions recommended for different programming languages, some companies and individuals prefer to use own naming conventions for their tools. Therefore, Kayako decided to help here by introducing support of different letter cases for names used in our API.

The special `_case` argument can be used to instruct the API service to return names in these letter cases:

| Case | `_case` | Sample |
| --- | --- | --- |
| Snake | `_case=snake` | `snake_case` |
| Camel | `_case=camel` | `camelCase` |
| Pascal | `_case=pascal` | `PascalCase` |

By default the API service returns names in the "snake" case.

Additionally, the API service can understand names passed in API requests in all these cases.

Examples:

*   `fullName` and `FullName` are equivalent to `full_name`
*   `_Case` is equivalent to `_case`

## [](https://developer.kayako.com/api/v1/reference/special_options/#empty-fields-2)Empty fields

By default, empty fields (that contain `null` values or empty arrays) are included into the API response for the sake of consistency. This usually makes the response slightly bigger and, therefore, can be undesirable.

To remove fields from the API response, if their values are empty, use the `_empty` argument as follows:

```
?_empty=false
```

Alternatively, you can add the `no_empty` option to the `X-Options` HTTP header (separate options with `,`).

## [](https://developer.kayako.com/api/v1/reference/special_options/#flat-mode-3)Flat mode

In the default mode the API response can include some resources multiple times, if they appear as nested resources at different levels and/or under different containing resources. Each copy of such resource certainly makes the response message slightly bigger.

The special "flat" mode can be used to optimize the response message and, sometimes, to reduce its size by deliverying related resources separately under the special `resources` field of the response object.

This mode can be activated by the `_flat` argument:

```
?_flat=true
```

Alternatively, you can use the `X-Options` HTTP header with the `flat` option (separated by `,` from other ones, if any).

Here is an example of the API response in the "flat" mode:

```
{
    "status": 200,
    "data": {
        "id": 1,
        "name": "Test 1",
        "session_id": "OK8tYiWqIbWGDTK93GX2gnNpUQzLA9c013929a217d98f4d1bc1aa751676f05b9b072f46ZWMLEH0fH76NWlmQuhzCxCKfqnff",
        "authentication_scheme": "BASIC",
        "is_base_installed": true,
        "user": {
            "id": 1,
            "resource_type": "user"
        },
        "is_odd": true,
        "generation_time": 0.000134,
        "resource_type": "test",
        "resource_url": "https://brewfictus.kayako.com/api/v1/tests/1"
    },
    "resource": "test",
    "resources": {
        "role": {
            "1": {
                "id": 1,
                "title": "Agent",
                "type": "AGENT",
                "created_at": "2015-07-21T04:30:13+05:00",
                "updated_at": "2015-07-21T04:30:13+05:00",
                "resource_type": "role",
                "resource_url": "https://brewfictus.kayako.com/api/v1/roles/1"
            }
        },
        "identity_domain": {
            "5": {
                "id": 5,
                "domain": "brewfictus.com",
                "is_primary": true,
                "is_validated": false,
                "created_at": "2015-08-21T06:32:52+05:00",
                "updated_at": "2015-08-21T06:32:52+05:00",
                "resource_type": "identity_domain",
                "resource_url": "https://brewfictus.kayako.com/api/v1/identities/domains/5"
            }
        },
        "organization": {
            "7": {
                "id": 7,
                "name": "Brewfictus",
                "is_shared": false,
                "domains": [
                    {
                        "id": 5,
                        "resource_type": "identity_domain"
                    }
                ],
                "pinned_notes_count": 0,
                "created_at": "2015-08-21T06:32:52+05:00",
                "updated_at": "2015-08-21T06:32:52+05:00",
                "resource_type": "organization",
                "resource_url": "https://brewfictus.kayako.com/api/v1/organizations/7"
            }
        },
        "business_hour": {
            "1": {
                "id": 1,
                "title": "US office hours",
                "zones": {
                    "monday": [9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
                    "tuesday": [9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
                    "wednesday": [9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
                    "thursday": [9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
                    "friday": [9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
                },
                "created_at": "2015-07-21T04:30:13+05:00",
                "updated_at": "2015-07-21T04:30:13+05:00",
                "resource_type": "business_hour",
                "resource_url": "https://brewfictus.kayako.com/api/v1/businesshours/1"
            }
        },
        "team": {
            "1": {
                "id": 1,
                "title": "Growth",
                "businesshour": {
                    "id": 1,
                    "resource_type": "business_hour"
                },
                "created_at": "2015-07-21T04:30:13+05:00",
                "updated_at": "2015-07-21T04:30:13+05:00",
                "resource_type": "team",
                "resource_url": "https://brewfictus.kayako.com/api/v1/teams/1"
            }
        },
        "identity_email": {
            "1": {
                "id": 1,
                "email": "charlotte.kuchler@brewfictus.com",
                "is_primary": true,
                "is_validated": true,
                "is_notification_enabled": false,
                "created_at": "2015-07-21T04:30:13+05:00",
                "updated_at": "2015-07-21T04:30:13+05:00",
                "resource_type": "identity_email",
                "resource_url": "https://brewfictus.kayako.com/api/v1/identities/emails/1"
            }
        },
        "user": {
            "1": {
                "id": 1,
                "full_name": "Charlotte Küchler",
                "designation": "Community Manager",
                "is_enabled": true,
                "role": {
                    "id": 1,
                    "resource_type": "role"
                },
                "avatar": "https://brewfictus.kayako.com/avatar/get/aed21e-7619-5cb3-bbae-983015d3a",
                "agent_case_access": "ALL",
                "organization_case_access": null,
                "organization": {
                    "id": 7,
                    "resource_type": "organization"
                },
                "teams": [
                    {
                        "id": 1,
                        "resource_type": "team"
                    }
                ],
                "emails": [
                    {
                        "id": 1,
                        "resource_type": "identity_email"
                    }
                ],
                "pinned_notes_count": 0,
                "locale": "en-us",
                "last_seen_user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.125 Safari/537.36",
                "last_seen_ip": "89.76.11.90",
                "password_updated_at": "2015-07-21T04:30:13+05:00",
                "last_logged_in_at": "2015-07-21T10:17:58+05:00",
                "last_activity_at": "2015-07-21T10:17:58+05:00",
                "created_at": "2015-07-21T04:30:13+05:00",
                "updated_at": "2015-07-21T10:17:58+05:00",
                "resource_type": "user",
                "resource_url": "https://brewfictus.kayako.com/api/v1/users/1"
            }
        }
    }
}
```




### Using JavaScript

Title: Using Javascript - Reference | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/reference/using_javascript/

Published Time: Thu, 15 Feb 2018 07:35:46 GMT

Markdown Content:
# Using Javascript - Reference | Kayako Developers

[![Image 1](https://developer.kayako.com/img/kayako-logo.png)](https://developer.kayako.com/)

*     
*   [Docs](https://developer.kayako.com/docs/single_sign_on/introduction/)
*   [API](https://developer.kayako.com/api/v1/reference/introduction/)
*   [SDK](https://developer.kayako.com/sdk/java/integration_guide/)
*   [Messenger![Image 2: beta](https://developer.kayako.com/img/new.png)](https://developer.kayako.com/messenger/home/)

*     
*   [Docs](https://developer.kayako.com/docs/single_sign_on/introduction/)
*   [API](https://developer.kayako.com/api/v1/reference/introduction/)
*   [SDK](https://developer.kayako.com/sdk/java/integration_guide/)
*   [Messenger![Image 3: beta](https://developer.kayako.com/img/new.png)](https://developer.kayako.com/messenger/home/)

Reference

*   [Reference](https://developer.kayako.com/api/v1/reference/introduction/)
Core*   [Users](https://developer.kayako.com/api/v1/users/activities/)
*   [Cases](https://developer.kayako.com/api/v1/cases/activities/)
*   [Insights](https://developer.kayako.com/api/v1/insights/cases/)
*   [Search](https://developer.kayako.com/api/v1/search/search/)
*   [Automation](https://developer.kayako.com/api/v1/automation/endpoints/)
Channels*   [Twitter](https://developer.kayako.com/api/v1/twitter/accounts/)
*   [Facebook](https://developer.kayako.com/api/v1/facebook/accounts/)
*   [Mail](https://developer.kayako.com/api/v1/mail/mailboxes/)
*   [Event](https://developer.kayako.com/api/v1/event/events/)
*   [Help Center](https://developer.kayako.com/api/v1/help_center/articles/)
Others*   [General](https://developer.kayako.com/api/v1/general/autocomplete/)

*   [Introduction](https://developer.kayako.com/api/v1/reference/introduction/)
*   [Authentication](https://developer.kayako.com/api/v1/reference/authentication/)
*   [Request](https://developer.kayako.com/api/v1/reference/request/)
*   [Response](https://developer.kayako.com/api/v1/reference/response/)
*   [Data Types](https://developer.kayako.com/api/v1/reference/data_types/)
*   [Partial Output](https://developer.kayako.com/api/v1/reference/partial_output/)
*   [Pagination](https://developer.kayako.com/api/v1/reference/pagination/)
*   [File Upload](https://developer.kayako.com/api/v1/reference/file_upload/)
*   [Caching](https://developer.kayako.com/api/v1/reference/caching/)
*   [Security](https://developer.kayako.com/api/v1/reference/security/)
*   [Rate Limiting](https://developer.kayako.com/api/v1/reference/rate_limiting/)
*   [Special Options](https://developer.kayako.com/api/v1/reference/special_options/)
*   [Using Javascript](https://developer.kayako.com/api/v1/reference/using_javascript/)
*   [Errors](https://developer.kayako.com/api/v1/reference/using_javascript/)
    *   [ACTION_FAILED](https://developer.kayako.com/api/v1/reference/errors/ACTION_FAILED)
    *   [ANY_FIELD_REQUIRED](https://developer.kayako.com/api/v1/reference/errors/ANY_FIELD_REQUIRED)
    *   [APP_NOT_FOUND](https://developer.kayako.com/api/v1/reference/errors/APP_NOT_FOUND)
    *   [APP_REST_NOT_AVAILABLE](https://developer.kayako.com/api/v1/reference/errors/APP_REST_NOT_AVAILABLE)
    *   [ASSOCIATE_NOT_FOUND](https://developer.kayako.com/api/v1/reference/errors/ASSOCIATE_NOT_FOUND)
    *   [AUTHENTICATION_FAILED](https://developer.kayako.com/api/v1/reference/errors/AUTHENTICATION_FAILED)
    *   [AUTHENTICATION_LOCKED](https://developer.kayako.com/api/v1/reference/errors/AUTHENTICATION_LOCKED)
    *   [AUTHORIZATION_REQUIRED](https://developer.kayako.com/api/v1/reference/errors/AUTHORIZATION_REQUIRED)
    *   [CHECKSUM_MISMATCH](https://developer.kayako.com/api/v1/reference/errors/CHECKSUM_MISMATCH)
    *   [CONDITION_REQUIRED](https://developer.kayako.com/api/v1/reference/errors/CONDITION_REQUIRED)
    *   [CONTENT_NOT_AVAILABLE](https://developer.kayako.com/api/v1/reference/errors/CONTENT_NOT_AVAILABLE)
    *   [CREDENTIAL_EXPIRED](https://developer.kayako.com/api/v1/reference/errors/CREDENTIAL_EXPIRED)
    *   [CSRF_FAILED](https://developer.kayako.com/api/v1/reference/errors/CSRF_FAILED)
    *   [DELETION_FAILED](https://developer.kayako.com/api/v1/reference/errors/DELETION_FAILED)
    *   [EXCEPTION_CAUGHT](https://developer.kayako.com/api/v1/reference/errors/EXCEPTION_CAUGHT)
    *   [FEATURE_NOT_AVAILABLE](https://developer.kayako.com/api/v1/reference/errors/FEATURE_NOT_AVAILABLE)
    *   [FIELD_DUPLICATE](https://developer.kayako.com/api/v1/reference/errors/FIELD_DUPLICATE)
    *   [FIELD_EMPTY](https://developer.kayako.com/api/v1/reference/errors/FIELD_EMPTY)
    *   [FIELD_INVALID](https://developer.kayako.com/api/v1/reference/errors/FIELD_INVALID)
    *   [FIELD_REQUIRED](https://developer.kayako.com/api/v1/reference/errors/FIELD_REQUIRED)
    *   [FORMAT_NOT_ACCEPTABLE](https://developer.kayako.com/api/v1/reference/errors/FORMAT_NOT_ACCEPTABLE)
    *   [HTTPS_REQUIRED](https://developer.kayako.com/api/v1/reference/errors/HTTPS_REQUIRED)
    *   [LICENSE_EXPIRED](https://developer.kayako.com/api/v1/reference/errors/LICENSE_EXPIRED)
    *   [LICENSE_LIMIT_REACHED](https://developer.kayako.com/api/v1/reference/errors/LICENSE_LIMIT_REACHED)
    *   [METHOD_NOT_SUPPORTED](https://developer.kayako.com/api/v1/reference/errors/METHOD_NOT_SUPPORTED)
    *   [NONCE_DUPLICATE](https://developer.kayako.com/api/v1/reference/errors/NONCE_DUPLICATE)
    *   [ONE_FIELD_EXPECTED](https://developer.kayako.com/api/v1/reference/errors/ONE_FIELD_EXPECTED)
    *   [OTP_EXPECTED](https://developer.kayako.com/api/v1/reference/errors/OTP_EXPECTED)
    *   [PARAMETERS_INCONSISTENT](https://developer.kayako.com/api/v1/reference/errors/PARAMETERS_INCONSISTENT)
    *   [PARAMETER_INVALID](https://developer.kayako.com/api/v1/reference/errors/PARAMETER_INVALID)
    *   [PASSWORD_POLICY_VIOLATION](https://developer.kayako.com/api/v1/reference/errors/PASSWORD_POLICY_VIOLATION)
    *   [PERMISSIONS_DENIED](https://developer.kayako.com/api/v1/reference/errors/PERMISSIONS_DENIED)
    *   [PORTAL_NOT_SUPPORTED](https://developer.kayako.com/api/v1/reference/errors/PORTAL_NOT_SUPPORTED)
    *   [RATE_LIMIT_REACHED](https://developer.kayako.com/api/v1/reference/errors/RATE_LIMIT_REACHED)
    *   [REQUEST_FIELDS_EMPTY](https://developer.kayako.com/api/v1/reference/errors/REQUEST_FIELDS_EMPTY)
    *   [RESOURCES_DO_NOT_MATCH](https://developer.kayako.com/api/v1/reference/errors/RESOURCES_DO_NOT_MATCH)
    *   [RESOURCE_ACTION_NOT_AVAILABLE](https://developer.kayako.com/api/v1/reference/errors/RESOURCE_ACTION_NOT_AVAILABLE)
    *   [RESOURCE_EXISTS](https://developer.kayako.com/api/v1/reference/errors/RESOURCE_EXISTS)
    *   [RESOURCE_GONE](https://developer.kayako.com/api/v1/reference/errors/RESOURCE_GONE)
    *   [RESOURCE_MODIFIED](https://developer.kayako.com/api/v1/reference/errors/RESOURCE_MODIFIED)
    *   [RESOURCE_NOT_AVAILABLE](https://developer.kayako.com/api/v1/reference/errors/RESOURCE_NOT_AVAILABLE)
    *   [RESOURCE_NOT_FOUND](https://developer.kayako.com/api/v1/reference/errors/RESOURCE_NOT_FOUND)
    *   [SESSION_CREATION_FAILED](https://developer.kayako.com/api/v1/reference/errors/SESSION_CREATION_FAILED)
    *   [SESSION_LOADING_FAILED](https://developer.kayako.com/api/v1/reference/errors/SESSION_LOADING_FAILED)
    *   [TIMESTAMP_MISMATCH](https://developer.kayako.com/api/v1/reference/errors/TIMESTAMP_MISMATCH)
    *   [TIMESTAMP_MISSING](https://developer.kayako.com/api/v1/reference/errors/TIMESTAMP_MISSING)
    *   [URL_ARGUMENT_REDUNDANT](https://developer.kayako.com/api/v1/reference/errors/URL_ARGUMENT_REDUNDANT)
    *   [URL_ARGUMENT_REQUIRED](https://developer.kayako.com/api/v1/reference/errors/URL_ARGUMENT_REQUIRED)
    *   [URL_RESOURCE_MISSING](https://developer.kayako.com/api/v1/reference/errors/URL_RESOURCE_MISSING)
    *   [URL_TOO_MANY_SEGMENTS](https://developer.kayako.com/api/v1/reference/errors/URL_TOO_MANY_SEGMENTS)
    *   [URL_VERSION_MISSING](https://developer.kayako.com/api/v1/reference/errors/URL_VERSION_MISSING)
    *   [VERSION_NOT_SUPPORTED](https://developer.kayako.com/api/v1/reference/errors/VERSION_NOT_SUPPORTED)

*   [Preferences](https://developer.kayako.com/private/v1/notifications/preferences/private/v1/notifications/preferences)

1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   REFERENCE

# Using Javascript

The obstacle of using the API with JavaScript is the [same-origin security policy](https://en.wikipedia.org/wiki/Same-origin_policy), that can make this usage scenario very troublesome.

The API service supports two techniques, that can make JavaScript work with the API on different domains.

## CORS (Cross-Origin Resource Sharing)

[CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) is a special protocol, which works over HTTP, that allows JavaScript and the API service to negotiate, whether the API request should be permitted or restricted.

The preflight mode of CORS is also supported by the API service.

To allow API requests from a specific domain, you need to add it to the the list of allowed domains using the Kayako UI.

The CORS interaction is handled by the web browser and the API service automatically, what means that you usually do not need to worry about technical details.

But, you can read more about CORS [here](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing).

## JSONP (JSON with Padding)

_Important:_ Consider using CORS instead.

[JSONP](https://en.wikipedia.org/wiki/JSONP) is actually a hack, that allows to make an API request from JavaScript to another domain.

JSONP can be enabled by the `_jsonp_callback` argument, e.g.:

```text
?_jsonp_callback=callbackName
```

Here, the `callbackName` is the name of an existing JavaScript function, that will handle the API response.

JSONP requests can use only the `GET` HTTP method.

Also, JSONP does not work with HTTP status codes other than **200** (OK) (or **201** (Created)). That's why the status code of JSONP API responses is always **200** (OK). Therefore, in such cases you need to check the `status` field of the API response for the proper HTTP status code (see also [Response](https://developer.kayako.com/api/v1/reference/response/)).

You can read more about JSONP [here](https://en.wikipedia.org/wiki/JSONP).

 Copyright © 2018 [Kayako](http://www.kayako.com/). All rights reserved • [Privacy Policy](http://www.kayako.com/about/privacy)

[](https://www.facebook.com/kayako/)[](https://twitter.com/kayako)




---

## Core / Users


### Activities

Title: Activities - Users | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/users/activities/

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   CORE
4.   USERS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| activity | string |  | _An identifier for the activity_. create_user, update_user etc. |
| actor | [Actor](https://developer.kayako.com/api/v1/users/activities/#actor) |  | _Who did it_. The user/system that carried out this activity |
| verb | string |  | _What they did_. CREATE, SHARE, JOIN, LIKE, NOTIFY etc. |
| summary | string |  |  |
| actions | [Actions](https://developer.kayako.com/api/v1/users/activities/#actions) |  |  |
| object | [Object](https://developer.kayako.com/api/v1/users/activities/#object) |  | _Activity performed on_. Conversation, Team, Event etc. |
| object_actor | [Actor](https://developer.kayako.com/api/v1/users/activities/#actor) |  | If this activity's object is itself another activity, this property specifies the original activity's actor |
| location | [Location](https://developer.kayako.com/api/v1/users/activities/#location) |  |  |
| place | [Place](https://developer.kayako.com/api/v1/users/activities/#place) |  | Where the activity was carried out |
| target | [Target](https://developer.kayako.com/api/v1/users/activities/#target) |  | Describes object targetted by activity |
| result | [Result](https://developer.kayako.com/api/v1/users/activities/#result) |  | Describes the result of the activity |
| in_reply_to | [InReplyTo](https://developer.kayako.com/api/v1/users/activities/#inreplyto) |  | Identifying an object which can be considered as a response to the base object |
| participant | [Participant](https://developer.kayako.com/api/v1/users/activities/#participant) |  |  |
| portal | string |  |  |
| weight | float |  | Weight decides the priority/importance of this activity |
| ip_address | string |  |  |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Actions

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| action | string |  | `CREATED`, `UPDATED`, `DELETED` |
| field | string |  |  |
| old_value | string |  |  |
| new_value | string |  |  |
| old_object | Resource |  |  |
| new_object | Resource |  |  |

## Actor

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| titile | string |  |  |
| prefix | string |  |  |
| url | string |  |  |
| full_title | string |  |  |
| image | string |  |  |
| preposition | string |  |  |
| original | Resource |  |  |

## Object

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| titile | string |  |  |
| prefix | string |  |  |
| url | string |  |  |
| full_title | string |  |  |
| image | string |  |  |
| preposition | string |  |  |
| original | Resource |  |  |

## Place

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| titile | string |  |  |
| prefix | string |  |  |
| url | string |  |  |
| full_title | string |  |  |
| image | string |  |  |
| preposition | string |  |  |
| original | Resource |  |  |

## Target

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| titile | string |  |  |
| prefix | string |  |  |
| url | string |  |  |
| full_title | string |  |  |
| image | string |  |  |
| preposition | string |  |  |
| original | Resource |  |  |

## Result

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| titile | string |  |  |
| prefix | string |  |  |
| url | string |  |  |
| full_title | string |  |  |
| image | string |  |  |
| preposition | string |  |  |
| original | Resource |  |  |

## InReplyTo

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| titile | string |  |  |
| prefix | string |  |  |
| url | string |  |  |
| full_title | string |  |  |
| image | string |  |  |
| preposition | string |  |  |
| original | Resource |  |  |

## Participant

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| titile | string |  |  |
| prefix | string |  |  |
| url | string |  |  |
| full_title | string |  |  |
| image | string |  |  |
| preposition | string |  |  |
| original | Resource |  |  |

## Location

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| city | string |  |  |
| region | string |  |  |
| region_code | string |  |  |
| area_code | string |  |  |
| time_zone | string |  |  |
| organization | string |  |  |
| net_speed | string |  | The network speed associated with the IP address. |
| country | string |  |  |
| country_code | string |  |  |
| postal_code | string |  |  |
| latitude | string |  |  |
| longitude | string |  |  |
| metro_code | string |  | The metro code associated with the IP address. These are only available for IP addresses in the US. |
| isp | string |  | The name of the Internet Service Provider associated with the IP address. |

## Retrieve activities

GET**/api/v1/users/:id/activities.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)
Ordered by created_at (descending)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| minimum_weight | float |  | Filter activities by their minimum weight |
| since | timestamp |  | Filter activities newer than specified date |
| until | timestamp |  | Filter activities older than specified date |
| sort_order | string |  | `ASC`, `DESC` **Default:**`DESC` |

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 12,
            "activity": "create_case",
            "actor": {
                "name": "user",
                "title": "Simon Blackhouse",
                "prefix": "@",
                "url": "https://brewfictus.kayako.com/user/1",
                "full_title": "Simon Blackhouse",
                "image": "",
                "preposition": null,
                "original": {
                    "id": 1,
                    "resource_type": "user"
                },
                "resource_type": "activity_actor"
            },
            "verb": "create",
            "summary": "<@https://brewfictus.kayako.com/user/1|Phoebe Todd> created <https://brewfictus.kayako.com/case/view/1|Atmosphere Coffee, Inc annual maintenance>",
            "actions": [],
            "object": {
                "id": 1,
                "resource_type": "case"
            },
            "object_actor": null,
            "location": null,
            "place": null,
            "target": null,
            "result": null,
            "in_reply_to": null,
            "participant": null,
            "portal": "API",
            "weight": 0.8,
            "ip_address": null,
            "created_at": "2015-07-27T11:35:09+05:00",
            "resource_type": "activity"
        }
    ],
    "resource": "activity",
    "limit": 10,
    "total_count": 1
}
```




### Cases

Title: Cases - Users | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/users/cases/

Published Time: Thu, 15 Feb 2018 07:35:46 GMT

Markdown Content:
```
{
        "status": 200,
        "data": [
            {
    "id": 1,

    "legacy_id": "YAK-923-46434",
    "subject": "Atmosphere Coffee, Inc annual maintenance",
    "portal": "API",
    "source_channel": {
    "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",

    "resource_type": "channel"
},
    "last_public_channel": {
    "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",

    "resource_type": "channel"
},
    "requester": 

{
    "id": 2,

    "resource_type": "user"

}
,
    "creator": 

{
    "id": 1,

    "resource_type": "user"

}
,
    "identity": {
    "id": 1,

    "resource_type": "identity_email"

},
    "assigned_agent": 

{
    "id": 1,

    "resource_type": "user"

}
,
    "assigned_team": {
    "id": 1,
    "legacy_id": null,

    "resource_type": "team"

},
    "last_assigned_by": 

{
    "id": 1,

    "resource_type": "user"

}
,
    "brand": {
    "id": 1,

    "resource_type": "brand"

}
,
    "status": {
    "id": 1,

    "resource_type": "case_status"

},
    "priority": {
    "id": 3,

    "resource_type": "case_priority"

},
    "type": {
    "id": 1,

    "resource_type": "case_type"

}
,
    "read_marker": {
  "id": 1,

  "resource_type": "read_marker"
},
    "sla_version": {
        "id": 1,
        "resource_type": "sla_version"
    },
    "sla_metrics": [

{
    "id": 1,

    "resource_type": "sla_metric"
},

{
    "id": 2,

    "resource_type": "sla_metric"
},

{
    "id": 3,

    "resource_type": "sla_metric"
}
    ],
    "form": {
    "id": 1,

    "resource_type": "case_form"

}

,
    "custom_fields": [
        {
            "field": {
    "id": 1,

    "resource_type": "case_field"

},
            "value": "3",
            "resource_type": "case_field_value"
        }
    ],
    "last_replier": 

{
    "id": 1,

    "resource_type": "user"

}
,
    "last_replier_identity": {
    "id": 1,

    "resource_type": "identity_email"

},
    "last_completed_by": null,
    "last_updated_by": null,
    "last_closed_by": null,
    "state": "ACTIVE",
    "post_count": 2,
    "has_notes": false,
    "pinned_notes_count": 0,
    "has_attachments": false,
    "is_merged": false,
    "rating": null,
    "rating_status": "UNOFFERED",
    "last_post_status": "SEEN",
    "last_post_preview": "My HubID is 525862. I'm trying to send a notification email to my salespeople when a contact is assigned to them. All of my other salespeople are receiving the emails fine, but for one person they never arrived. We checked in their SPAM folder, but the...",
    "last_post_type": "PUBLIC",
    "last_message_preview": "My HubID is 525862. I'm trying to send a notification email to my salespeople when a contact is assigned to them. All of my other salespeople are receiving the emails fine, but for one person they never arrived. We checked in their SPAM folder, but the...",
    "realtime_channel": "presence-d6c6a8b31be92885222ee53dde6c99c745c5f4cf77f1bd9dd3519d07fa730c71@v1_cases_1",
    "last_assigned_at": "2015-07-30T06:45:25+05:00",
    "last_replied_at": "2015-07-27T11:35:09+05:00",
    "last_opened_at": null,
    "last_pending_at": null,
    "last_closed_at": null,
    "last_completed_at": null,
    "last_agent_activity_at": null,
    "last_customer_activity_at": "2015-07-30T06:45:25+05:00",
    "last_reply_by_agent_at": null,
    "last_reply_by_requester_at": null,
    "agent_updated_at": null,
    "latest_assignee_update": null,
    "created_at": "2015-07-30T06:45:25+05:00",
    "updated_at": "2015-07-30T06:45:25+05:00",

    "resource_type": "case"

    ,"resource_url": "https://brewfictus.kayako.com/api/v1/cases/1"

}

        ],
        "resource": "case",
        "offset": 0,
        "limit": 10,
        "total_count": 1
    }
```




### Fields

Title: Fields - Users | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/users/fields/

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   CORE
4.   USERS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| fielduuid | string |  | The fielduuid is unique to this field |
| title | string |  |  |
| type | string |  | `TEXT`, `TEXTAREA`, `CHECKBOX`, `RADIO`, `SELECT`, `DATE`, `FILE`, `NUMERIC`, `DECIMAL`, `YESNO`, `CASCADINGSELECT`, `REGEX` |
| key | string |  | The key is unique to this field |
| is_visible_to_customers | boolean |  | **Default:**`false` |
| customer_titles | [locale/fields](https://developer.kayako.com/api/v1/general/field_locales/) |  |  |
| is_customer_editable | boolean |  | **Default:**`false` |
| is_required_for_customers | boolean |  | **Default:**`false` |
| descriptions | [locale/fields](https://developer.kayako.com/api/v1/general/field_locales/) |  |  |
| regular_expression | string |  |  |
| sort_order | integer |  |  |
| is_enabled | boolean |  |  |
| options | [Options](https://developer.kayako.com/api/v1/users/fields/#Options) |  |  |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve all fields

GET**/api/v1/users/fields.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)
Ordered by sort_order (ascending)

Collaborators and Agents can only see the enabled fields.

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "fielduuid": "aaa7c4de-7633-479b-a26f-38bbe75c6727",
            "title": "Industry",
            "type": "TEXT",
            "key": "industry",
            "is_visible_to_customers": true,
            "customer_titles": [
                {
                    "id": 1,
                    "resource_type": "locale_field"
                },
                {
                    "id": 2,
                    "resource_type": "locale_field"
                }
            ],
            "is_customer_editable": true,
            "is_required_for_customers": true,
            "descriptions": [],
            "regular_expression": null,
            "sort_order": 1,
            "is_enabled": true,
            "options": [],
            "created_at": "2015-11-05T10:48:34+05:00",
            "updated_at": "2015-11-05T10:48:34+05:00",
            "resource_type": "user_field",
            "resource_url": "https://brewfictus.kayako.com/api/v1/users/fields/1"
        }
    ],
    "resource": "user_field",
    "total_count": 1
}
```

## Retrieve a field

GET**/api/v1/users/fields/:id.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

Collaborators and Agents can only see the enabled field.

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "fielduuid": "aaa7c4de-7633-479b-a26f-38bbe75c6727",
        "title": "Industry",
        "type": "TEXT",
        "key": "industry",
        "is_visible_to_customers": true,
        "customer_titles": [
            {
                "id": 1,
                "resource_type": "locale_field"
            },
            {
                "id": 2,
                "resource_type": "locale_field"
            }
        ],
        "is_customer_editable": true,
        "is_required_for_customers": true,
        "descriptions": [],
        "regular_expression": null,
        "sort_order": 1,
        "is_enabled": true,
        "options": [],
        "created_at": "2015-11-05T10:48:34+05:00",
        "updated_at": "2015-11-05T10:48:34+05:00",
        "resource_type": "user_field",
        "resource_url": "https://brewfictus.kayako.com/api/v1/users/fields/1"
    },
    "resource": "user_field"
}
```

## Add a field

POST**/api/v1/users/fields.json**

### Information

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string |  | `TEXT`, `TEXTAREA`, `CHECKBOX`, `RADIO`, `SELECT`, `DATE`, `FILE`, `NUMERIC`, `DECIMAL`, `YESNO`, `CASCADINGSELECT`, `REGEX` **Note:** If field type `CHECKBOX`, `RADIO`, `SELECT`, `CASCADINGSELECT`[Add Options](https://developer.kayako.com/api/v1/users/fields#Options) |
| title | string |  |  |
| is_visible_to_customers | boolean |  | **Default:**`false` |
| customer_titles | string |  | Only applicable when "Customers can see this field" is enabled |
| is_customer_editable | boolean |  | Only applicable when "Customers can see this field" is enabled **Default:**`false` |
| is_required_for_customers | boolean |  | Only applicable when "Customers can edit this field" is enabled **Default:**`false` |
| descriptions | string |  | User-defined description of this field's purpose |
| is_enabled | boolean |  | **Default:**`true` |
| regular_expression | string |  | Regular expression field only. The validation pattern for a field value to be deemed valid. |
| options | string |  |  |

### Request

```
curl -X POST https://brewfictus.kayako.com/api/v1/users/fields \
     -d '{"title":"Industry","type":"TEXT","is_visible_to_customers":true,"customer_titles":[{"locale":"en-us", "translation": "Industry"}, {"locale":"fr", "translation": "industri"}],descriptions":[],"is_customer_editable":true,"is_required_for_customers":true,"regular_expression":null,"is_enabled":true}' \
     -H "Content-Type: application/json" \
     -u 'jordan.mitchell@brewfictus.com:jmit6#lsXo'
```

### Response

```
{
    "status": 201,
    "data": {
        "id": 1,
        "fielduuid": "aaa7c4de-7633-479b-a26f-38bbe75c6727",
        "title": "Industry",
        "type": "TEXT",
        "key": "industry",
        "is_visible_to_customers": true,
        "customer_titles": [
            {
                "id": 1,
                "resource_type": "locale_field"
            },
            {
                "id": 2,
                "resource_type": "locale_field"
            }
        ],
        "is_customer_editable": true,
        "is_required_for_customers": true,
        "descriptions": [],
        "regular_expression": null,
        "sort_order": 1,
        "is_enabled": true,
        "options": [],
        "created_at": "2015-11-05T10:48:34+05:00",
        "updated_at": "2015-11-05T10:48:34+05:00",
        "resource_type": "user_field",
        "resource_url": "https://brewfictus.kayako.com/api/v1/users/fields/1"
    },
    "resource": "user_field"
}
```

## Update a field

PUT**/api/v1/users/fields/:id.json**

### Information

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| title | string |  |  |
| is_visible_to_customers | boolean |  |  |
| customer_titles | string |  |  |
| is_customer_editable | boolean |  |  |
| is_required_for_customers | boolean |  |  |
| descriptions | string |  |  |
| is_enabled | boolean |  |  |
| regular_expression | string |  |  |
| options | string |  |  |

### Request

```
curl -X PUT https://brewfictus.kayako.com/api/v1/users/fields/:id \
     -d '{"title":"Industry","type":"TEXT","is_visible_to_customers":true,"customer_titles":[{"id":"28",locale":"en-us", "translation": "Industry"}, {"id":"29","locale":"fr", "translation": "industri"}],descriptions":[],"is_customer_editable":true,"is_required_for_customers":true,"regular_expression":null,"is_enabled":true}' \
     -H "Content-Type: application/json" \
     -u 'jordan.mitchell@brewfictus.com:jmit6#lsXo'
```

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "fielduuid": "aaa7c4de-7633-479b-a26f-38bbe75c6727",
        "title": "Industry",
        "type": "TEXT",
        "key": "industry",
        "is_visible_to_customers": true,
        "customer_titles": [
            {
                "id": 1,
                "resource_type": "locale_field"
            },
            {
                "id": 2,
                "resource_type": "locale_field"
            }
        ],
        "is_customer_editable": true,
        "is_required_for_customers": true,
        "descriptions": [],
        "regular_expression": null,
        "sort_order": 1,
        "is_enabled": true,
        "options": [],
        "created_at": "2015-11-05T10:48:34+05:00",
        "updated_at": "2015-11-05T10:48:34+05:00",
        "resource_type": "user_field",
        "resource_url": "https://brewfictus.kayako.com/api/v1/users/fields/1"
    },
    "resource": "user_field"
}
```

## Reorder fields

PUT**/api/v1/users/fields/reorder.json**

### Information

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| field_ids | string |  | Pass the fields in order you want to set |

### Response

```
{
    "status": 200,
    "total_count": 3
}
```

## Delete a field

DELETE**/api/v1/users/fields/:id.json**

### Information

### Response

```
{
    "status": 200
}
```

## Delete fields

DELETE**/api/v1/users/fields.json**

### Information

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```

## Options

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| fielduuid | string |  |  |
| values | [Field Locales](https://developer.kayako.com/api/v1/general/field_locales/) |  |  |
| sort_order | integer |  | Ordering of the option relative to other options |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Reorder options

PUT**/api/v1/users/fields/:id/options/reorder.json**

### Information

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| option_ids | string |  | Pass the options in order you want to set |

### Response

```
{
    "status": 200,
    "total_count": 3
}
```

## Delete a option

DELETE**/api/v1/users/fields/:id/options/:id.json**

### Information

### Response

```
{
    "status": 200
}
```

## Delete options

DELETE**/api/v1/users/fields/:id/options.json**

### Information

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```

## Values

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| field | [Field](https://developer.kayako.com/api/v1/users/fields) |  |  |
| value | string |  |  |

## Retrieve values

GET**/api/v1/users/:id/field/values.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Response

```
{
    "status": 200,
    "data": [
        {
            "field": {
                "id": 1,
                "resource_type": "user_field"
            },
            "value": "Helpdesk",
            "resource_type": "user_field_value"
        }
    ],
    "resource": "user_field_value",
    "total_count": 1
}
```




### Identities

Title: Identities - Users | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/users/identities/

Published Time: Thu, 15 Feb 2018 07:35:46 GMT

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   CORE
4.   USERS

## Emails

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| email | string |  |  |
| is_primary | boolean |  | **Default:**`false` |
| is_validated | boolean |  | **Default:**`false` |
| is_notification_enabled | boolean |  | **Default:**`false` |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve all emails

GET**/api/v1/identities/emails.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)
Ordered by is_primary, updated_at (descending)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| user_id | integer |  | The id of the [User](https://developer.kayako.com/api/v1/users/users/) |

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "email": "simon.blackhouse@brewfictus.com",
            "is_primary": true,
            "is_validated": true,
            "is_notification_enabled": false,
            "created_at": "2016-04-22T11:52:04+00:00",
            "updated_at": "2016-04-22T11:52:30+00:00",
            "resource_type": "identity_email",
            "resource_url": "https://brewfictus.kayako.com/api/v1/identities/emails/1"
        }
    ],
    "resource": "identity_email",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Retrieve an email

GET**/api/v1/identities/emails/:id.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "email": "simon.blackhouse@brewfictus.com",
        "is_primary": true,
        "is_validated": true,
        "is_notification_enabled": false,
        "created_at": "2016-04-22T11:52:04+00:00",
        "updated_at": "2016-04-22T11:52:30+00:00",
        "resource_type": "identity_email",
        "resource_url": "https://brewfictus.kayako.com/api/v1/identities/emails/1"
    },
    "resource": "identity_email"
}
```

## Add an email

POST**/api/v1/identities/emails.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| user_id | integer |  | The id of the [User](https://developer.kayako.com/api/v1/users/users/) |
| email | string |  |  |
| is_primary | boolean |  | **Default:**`false` |
| is_validated | boolean |  | Applicable for the role type `AGENT`, `ADMIN`, `OWNER` **Default:**`false` |
| is_notification_enabled | boolean |  | **Default:**`false` |

### Response

```
{
    "status": 201,
    "data": {
        "id": 1,
        "email": "simon.blackhouse@brewfictus.com",
        "is_primary": true,
        "is_validated": true,
        "is_notification_enabled": false,
        "created_at": "2016-04-22T11:52:04+00:00",
        "updated_at": "2016-04-22T11:52:30+00:00",
        "resource_type": "identity_email",
        "resource_url": "https://brewfictus.kayako.com/api/v1/identities/emails/1"
    },
    "resource": "identity_email"
}
```

## Update an email

PUT**/api/v1/identities/emails/:id.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| is_primary | boolean |  |  |
| is_validated | boolean |  | Applicable for the role type `AGENT`, `ADMIN`, `OWNER` |
| is_notification_enabled | boolean |  |  |

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "email": "simon.blackhouse@brewfictus.com",
        "is_primary": true,
        "is_validated": true,
        "is_notification_enabled": false,
        "created_at": "2016-04-22T11:52:04+00:00",
        "updated_at": "2016-04-22T11:52:30+00:00",
        "resource_type": "identity_email",
        "resource_url": "https://brewfictus.kayako.com/api/v1/identities/emails/1"
    },
    "resource": "identity_email"
}
```

## Send verification email

PUT**/api/v1/identities/emails/:id/send_verification_email.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Response

```
{
    "status": 200,
    "notifications": [
        {
            "type": "INFO",
            "message": "An email has been sent to your email id",
            "sticky": false
        }
    ]
}
```

## Delete an email

DELETE**/api/v1/identities/emails/:id.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Response

```
{
    "status": 200
}
```

## Delete emails

DELETE**/api/v1/identities/emails.json**

### Information

Allowed for Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```

## Phones

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| number | string |  |  |
| is_primary | boolean |  | **Default:**`false` |
| is_validated | boolean |  | **Default:**`false` |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve all phones

GET**/api/v1/identities/phones.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)
Ordered by is_primary, updated_at (descending)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| user_id | integer |  | The id of the [User](https://developer.kayako.com/api/v1/users/users/) |

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "number": "+14155550104",
            "is_primary": true,
            "is_validated": false,
            "created_at": "2016-03-15T10:38:01+05:00",
            "updated_at": "2016-03-15T10:38:01+05:00",
            "resource_type": "identity_phone",
            "resource_url": "https://brewfictus.kayako.com/api/v1/identities/phones/1"
        }
    ],
    "resource": "identity_phone",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Retrieve a phone

GET**/api/v1/identities/phones/:id.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "number": "+14155550104",
        "is_primary": true,
        "is_validated": false,
        "created_at": "2016-03-15T10:38:01+05:00",
        "updated_at": "2016-03-15T10:38:01+05:00",
        "resource_type": "identity_phone",
        "resource_url": "https://brewfictus.kayako.com/api/v1/identities/phones/1"
    },
    "resource": "identity_phone"
}
```

## Add a phone

POST**/api/v1/identities/phones.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| user_id | integer |  | The id of the [User](https://developer.kayako.com/api/v1/users/users/) |
| number | string |  |  |
| is_primary | boolean |  | **Default:**`false` |
| is_validated | boolean |  | Applicable for the role type `AGENT`, `ADMIN`, `OWNER` **Default:**`false` |

### Response

```
{
    "status": 201,
    "data": {
        "id": 1,
        "number": "+14155550104",
        "is_primary": true,
        "is_validated": false,
        "created_at": "2016-03-15T10:38:01+05:00",
        "updated_at": "2016-03-15T10:38:01+05:00",
        "resource_type": "identity_phone",
        "resource_url": "https://brewfictus.kayako.com/api/v1/identities/phones/1"
    },
    "resource": "identity_phone"
}
```

## Update a phone

PUT**/api/v1/identities/phones/:id.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| is_primary | boolean |  |  |
| is_validated | boolean |  | Applicable for the role type `AGENT`, `ADMIN`, `OWNER` |

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "number": "+14155550104",
        "is_primary": true,
        "is_validated": false,
        "created_at": "2016-03-15T10:38:01+05:00",
        "updated_at": "2016-03-15T10:38:01+05:00",
        "resource_type": "identity_phone",
        "resource_url": "https://brewfictus.kayako.com/api/v1/identities/phones/1"
    },
    "resource": "identity_phone"
}
```

## Delete a phone

DELETE**/api/v1/identities/phones/:id.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Response

```
{
    "status": 200
}
```

## Delete phones

DELETE**/api/v1/identities/phones.json**

### Information

Allowed for Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```

## Twitter

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| twitter_id | string |  |  |
| full_name | string |  |  |
| screen_name | string |  |  |
| follower_count | integer |  |  |
| description | string |  |  |
| url | string |  |  |
| location | string |  |  |
| profile_image_url | string |  |  |
| locale | string |  |  |
| is_verified | boolean |  | **Default:**`false` |
| is_primary | boolean |  | **Default:**`false` |
| is_validated | boolean |  | **Default:**`false` |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve all accounts

GET**/api/v1/identities/twitter.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)
Ordered by is_primary, updated_at (descending)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| user_id | integer |  | The id of the [User](https://developer.kayako.com/api/v1/users/users/) |

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "twitter_id": "3156012171",
            "full_name": "Phoebe Todd",
            "screen_name": "phoebetodd",
            "follower_count": 0,
            "description": null,
            "url": null,
            "location": null,
            "profile_image_url": null,
            "locale": "en",
            "is_verified": false,
            "is_primary": false,
            "is_validated": false,
            "created_at": "2015-07-25T15:02:02+05:00",
            "updated_at": "2015-07-25T15:02:02+05:00",
            "resource_type": "identity_twitter",
            "resource_url": "https://brewfictus.kayako.com/api/v1/identities/twitter/1"
        }
    ],
    "resource": "identity_twitter",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Retrieve an account

GET**/api/v1/identities/twitter/:id.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "twitter_id": "3156012171",
        "full_name": "Phoebe Todd",
        "screen_name": "phoebetodd",
        "follower_count": 0,
        "description": null,
        "url": null,
        "location": null,
        "profile_image_url": null,
        "locale": "en",
        "is_verified": false,
        "is_primary": false,
        "is_validated": false,
        "created_at": "2015-07-25T15:02:02+05:00",
        "updated_at": "2015-07-25T15:02:02+05:00",
        "resource_type": "identity_twitter",
        "resource_url": "https://brewfictus.kayako.com/api/v1/identities/twitter/1"
    },
    "resource": "identity_twitter"
}
```

## Add a twitter account

POST**/api/v1/identities/twitter.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| user_id | integer |  | The id of the [User](https://developer.kayako.com/api/v1/users/users/) |
| screen_name | string |  |  |
| is_validated | boolean |  | Applicable for the role type `AGENT`, `ADMIN`, `OWNER` **Default:**`false` |

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "twitter_id": "3156012171",
        "full_name": "Phoebe Todd",
        "screen_name": "phoebetodd",
        "follower_count": 0,
        "description": null,
        "url": null,
        "location": null,
        "profile_image_url": null,
        "locale": "en",
        "is_verified": false,
        "is_primary": false,
        "is_validated": false,
        "created_at": "2015-07-25T15:02:02+05:00",
        "updated_at": "2015-07-25T15:02:02+05:00",
        "resource_type": "identity_twitter",
        "resource_url": "https://brewfictus.kayako.com/api/v1/identities/twitter/1"
    },
    "resource": "identity_twitter"
}
```

## Update a twitter account

PUT**/api/v1/identities/twitter/:id.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| is_primary | boolean |  |  |
| is_validated | boolean |  |  |

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "twitter_id": "3156012171",
        "full_name": "Phoebe Todd",
        "screen_name": "phoebetodd",
        "follower_count": 0,
        "description": null,
        "url": null,
        "location": null,
        "profile_image_url": null,
        "locale": "en",
        "is_verified": false,
        "is_primary": false,
        "is_validated": false,
        "created_at": "2015-07-25T15:02:02+05:00",
        "updated_at": "2015-07-25T15:02:02+05:00",
        "resource_type": "identity_twitter",
        "resource_url": "https://brewfictus.kayako.com/api/v1/identities/twitter/1"
    },
    "resource": "identity_twitter"
}
```

## Delete an account

DELETE**/api/v1/identities/twitter/:id.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Response

```
{
    "status": 200
}
```

## Delete accounts

DELETE**/api/v1/identities/twitter.json**

### Information

Allowed for Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```

## Facebook

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| facebook_id | string |  |  |
| user_name | string |  |  |
| full_name | string |  |  |
| email | string |  |  |
| bio | string |  |  |
| birth_date | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| website | string |  |  |
| profile_url | string |  |  |
| locale | string |  |  |
| is_verified | boolean |  | **Default:**`false` |
| is_primary | boolean |  | **Default:**`false` |
| is_validated | boolean |  | **Default:**`false` |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve all accounts

GET**/api/v1/identities/facebook.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)
Ordered by is_primary, updated_at (descending)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| user_id | integer |  | The id of the [User](https://developer.kayako.com/api/v1/users/users/) |

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "facebook_id": "1407638772888867",
            "user_name": null,
            "full_name": "Jordan Mitchell",
            "email": null,
            "bio": null,
            "birth_date": null,
            "website": null,
            "profile_url": null,
            "locale": null,
            "is_verified": false,
            "is_primary": false,
            "is_validated": false,
            "created_at": "2015-07-25T17:47:14+05:00",
            "updated_at": "2015-07-25T17:47:14+05:00",
            "resource_type": "identity_facebook",
            "resource_url": "https://brewfictus.kayako.com/api/v1/identities/facebook/1"
        }
    ],
    "resource": "identity_facebook",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Retrieve an account

GET**/api/v1/identities/facebook/:id.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "facebook_id": "1407638772888867",
        "user_name": null,
        "full_name": "Jordan Mitchell",
        "email": null,
        "bio": null,
        "birth_date": null,
        "website": null,
        "profile_url": null,
        "locale": null,
        "is_verified": false,
        "is_primary": false,
        "is_validated": false,
        "created_at": "2015-07-25T17:47:14+05:00",
        "updated_at": "2015-07-25T17:47:14+05:00",
        "resource_type": "identity_facebook",
        "resource_url": "https://brewfictus.kayako.com/api/v1/identities/facebook/1"
    },
    "resource": "identity_facebook"
}
```

## Update a facebook account

PUT**/api/v1/identities/facebook/:id.json**

### Information

Allowed for Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| is_primary | boolean |  |  |
| is_validated | boolean |  |  |

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "facebook_id": "1407638772888867",
        "user_name": null,
        "full_name": "Jordan Mitchell",
        "email": null,
        "bio": null,
        "birth_date": null,
        "website": null,
        "profile_url": null,
        "locale": null,
        "is_verified": false,
        "is_primary": false,
        "is_validated": false,
        "created_at": "2015-07-25T17:47:14+05:00",
        "updated_at": "2015-07-25T17:47:14+05:00",
        "resource_type": "identity_facebook",
        "resource_url": "https://brewfictus.kayako.com/api/v1/identities/facebook/1"
    },
    "resource": "identity_facebook"
}
```

## Delete an account

DELETE**/api/v1/identities/facebook/:id.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Response

```
{
    "status": 200
}
```

## Delete accounts

DELETE**/api/v1/identities/facebook.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```




### Me

Title: Me - Users | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/users/me/

Markdown Content:
```
{
    "status": 200,
    "data": {
        "id": 1,
        "uuid": "11b60c25-c44c-47b8-9f48-56631cd7fa01",
        "full_name": "Simon Blackhouse",
        "legacy_id": null,
        "designation": "Community Manager",
        "is_enabled": true,
        "is_mfa_enabled": true,
        "role": {
            "id": 2,
            "resource_type": "role"
        },
        "avatar": "https://brewfictus.kayako.com/avatar/get/24ee2d81-ad95-5ae1-a07e-7ccedcdb70b8",
        "agent_case_access": "ALL",
        "organization_case_access": null,
        "organization": {
            "id": 1,
            "resource_type": "organization"
        },
        "teams": [],
        "emails": [
            {
                "id": 1,
                "resource_type": "identity_email"
            }
        ],
        "phones": [
            {
                "id": 1,
                "resource_type": "identity_phone"
            }
        ],
        "twitter": [],
        "facebook": [],
        "external_identifiers": [],
        "addresses": [
            {
                "id": 1,
                "resource_type": "contact_address"
            }
        ],
        "websites": [
            {
                "id": 1,
                "resource_type": "contact_website"
            }
        ],
        "custom_fields": [
            {
                "field": {
                    "id": 1,
                    "resource_type": "user_field"
                },
                "value": "Customer Success",
                "resource_type": "user_field_value"
            }
        ],
        "pinned_notes_count": 0,
        "locale": "en-us",
        "time_zone": null,
        "time_zone_offset": null,
        "greeting": null,
        "signature": null,
        "status_message": null,
        "last_seen_user_agent": null,
        "last_seen_ip": null,
        "last_seen_at": null,
        "last_active_at": null,
        "realtime_channel": "presence-0c1c9535b26b749f815a22cb459a4a8084be77b6ac9515751ef5a743b190bef3@v1_users_6",
        "presence_channel": "user_presence-281f395f6f51d031a6d3db3489906c98285191ebac41bb744f9323f61af63433@5c98cdaa58dd91ff1119a476e8b3e305d2906d3b",
        "password_updated_at": "2016-03-15T10:38:01+05:00",
        "avatar_updated_at": null,
        "last_logged_in_at": null,
        "last_activity_at": null,
        "created_at": "2016-03-15T10:38:01+05:00",
        "updated_at": "2016-03-15T10:38:01+05:00",
        "permissions": [
            {
                "id": 177,
                "resource_type": "permission"
            }
        ],
        "notification_channel": "user_presence-282f395f6f51d031a6d3d3489906z9v8285191ebacb1bb744f9323f61af63433@4c98ydaa58dd9zff1119a476e8b3e305d2905d3b",
        "settings": [
            {
                "id": 1,
                "resource_type": "setting"
            },
            {
                "id": 2,
                "resource_type": "setting"
            },
            {
                "id": 3,
                "resource_type": "setting"
            }
        ],
        "resource_type": "user",
        "resource_url": "https://brewfictus.kayako.com/api/v1/users/1"
    },
    "resource": "user"
}
```




### Notes

Title: Notes - Users | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/users/notes/

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   CORE
4.   USERS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| body_text | string |  |  |
| body_html | string |  |  |
| is_pinned | boolean |  | **Default:**`false` |
| pinned_by | [User](https://developer.kayako.com/api/v1/users/users/) |  |  |
| user | [User](https://developer.kayako.com/api/v1/users/users/) |  |  |
| attachments | [Attachments](https://developer.kayako.com/api/v1/users/notes/#Attachments) |  |  |
| download_all | string |  | Download all attachment as zip |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Attachments

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| size | integer |  |  |
| width | integer |  | Only if the attachment is image |
| height | integer |  | Only if the attachment is image |
| type | string |  | Mime-type of the file |
| content_id | string |  | Content ID used for inline attachment |
| alt | string |  |  |
| url | string |  | The URL to view the attachment |
| url_download | string |  | The URL to download the attachment |
| thumbnails | [Thumbnails](https://developer.kayako.com/api/v1/users/notes/#thumbnails) |  |  |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Thumbnails

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| size | integer |  |  |
| width | integer |  |  |
| height | integer |  |  |
| type | string |  | Mime-type of the file |
| url | string |  | The URL to view the thumbnail |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve all notes

GET**/api/v1/users/:id/notes.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)
Ordered by created_at (descending)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| is_pinned | boolean |  |  |
| filter | string |  |  |

This end-point will list the notes which are on user and it's organization.

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "body_text": "Customer is using Honey - Blend. So communicate accordingly",
            "body_html": null,
            "is_pinned": true,
            "pinned_by": {
                "id": 1,
                "resource_type": "user"
            },
            "user": {
                "id": 1,
                "resource_type": "user"
            },
            "attachments": [],
            "download_all": null,
            "created_at": "2016-02-17T08:20:18+05:00",
            "updated_at": "2016-02-17T08:20:18+05:00",
            "resource_type": "note",
            "resource_url": "https://brewfictus.kayako.com/api/v1/users/1/notes/1"
        }
    ],
    "resource": "note",
    "offset": 0,
    "limit": 10,
    "total_count": 2
}
```

## Retreive a note

GET**/api/v1/users/:id/notes/:id.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "body_text": "Customer is using Honey - Blend. So communicate accordingly",
        "body_html": null,
        "is_pinned": true,
        "pinned_by": {
            "id": 1,
            "resource_type": "user"
        },
        "user": {
            "id": 1,
            "resource_type": "user"
        },
        "attachments": [],
        "download_all": null,
        "created_at": "2016-02-17T08:20:18+05:00",
        "updated_at": "2016-02-17T08:20:18+05:00",
        "resource_type": "note",
        "resource_url": "https://brewfictus.kayako.com/api/v1/users/1/notes/1"
    },
    "resource": "note"
}
```

## Add a note

POST**/api/v1/users/:id/notes.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| contents | string |  |  |
| is_html | boolean |  | If set to true then system will parse the contents through the purify service and render them **Default:**`false` |
| files[] | array |  | multipart/form-data |
| attachment_file_ids | [CSV](https://developer.kayako.com/api/v1/users/notes/#) |  |  |

### Response

```
{
    "status": 201,
    "data": {
        "id": 1,
        "body_text": "Customer is using Honey - Blend. So communicate accordingly",
        "body_html": null,
        "is_pinned": true,
        "pinned_by": {
            "id": 1,
            "resource_type": "user"
        },
        "user": {
            "id": 1,
            "resource_type": "user"
        },
        "attachments": [],
        "download_all": null,
        "created_at": "2016-02-17T08:20:18+05:00",
        "updated_at": "2016-02-17T08:20:18+05:00",
        "resource_type": "note",
        "resource_url": "https://brewfictus.kayako.com/api/v1/users/1/notes/1"
    },
    "resource": "note"
}
```

## Update a note

PUT**/api/v1/users/:id/notes/:id.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| is_pinned | boolean |  | If set to true then it wil appear as a pinned in the user and conversation timelines. |

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "body_text": "Customer is using Honey - Blend. So communicate accordingly",
        "body_html": null,
        "is_pinned": true,
        "pinned_by": {
            "id": 1,
            "resource_type": "user"
        },
        "user": {
            "id": 1,
            "resource_type": "user"
        },
        "attachments": [],
        "download_all": null,
        "created_at": "2016-02-17T08:20:18+05:00",
        "updated_at": "2016-02-17T08:20:18+05:00",
        "resource_type": "note",
        "resource_url": "https://brewfictus.kayako.com/api/v1/users/1/notes/1"
    },
    "resource": "note"
}
```




### Organizations

Title: Organizations - Users | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/users/organizations/

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   CORE
4.   USERS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| legacy_id | string |  |  |
| is_shared | boolean |  |  |
| domains | [Domains](https://developer.kayako.com/api/v1/users/organizations/#Domains) |  |  |
| phone | [Phone](https://developer.kayako.com/api/v1/users/organizations/#Phone) |  |  |
| addresses | [Addresses](https://developer.kayako.com/api/v1/users/organizations/#Addresses) |  |  |
| websites | [Websites](https://developer.kayako.com/api/v1/users/organizations/#Websites) |  |  |
| pinned_notes_count | integer |  |  |
| custom_fields | [Fields](https://developer.kayako.com/api/v1/users/organizations/#Fields) |  |  |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Propositions

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| label | string |  |  |
| field | string |  | Field name on which the rules will be applied |
| type | string |  | `NUMERIC`, `STRING`, `BOOLEAN`, `COLLECTION`, `DATE_ABSOLUTE`, `DATE_RELATIVE` |
| sub_type | string |  | Depends on type: **NUMERIC:**`FLOAT`, `INTEGER` **DATE_RELATIVE:**`PAST`, `PAST_OR_PRESENT`, `PRESENT`, `PAST_OR_FUTURE`, `FUTURE` |
| group | string |  | `DATE` for type `DATE_ABSOLUTE`, `DATE_RELATIVE` |
| input_type | string |  | `INTEGER`, `FLOAT`, `STRING`, `BOOLEAN`, `OPTIONS`, `MULTIPLE`, `TAGS`, `DATE_ABSOLUTE`, `DATE_RELATIVE`, `AUTOCOMPLETE` |
| operators | array |  | Depends on input_type: **INTEGER, FLOAT:**`comparison_equalto`, `comparison_greaterthan`, `comparison_lessthan` **STRING:**`string_contains_insensitive`, `comparison_equalto`, `comparison_not_equalto` **BOOLEAN:**`comparison_equalto`, `comparison_not_equalto` **OPTIONS:**`comparison_equalto`, `comparison_not_equalto` **TAGS:**`collection_contains_insensitive`, `collection_contains_any_insensitive`, `collection_does_not_contain_insensitive` **DATE_ABSOLUTE:**`date_is`, `date_is_not` **DATE_RELATIVE:**`date_after_or_on`, `date_before_or_on` |
| values | mixed |  | **Input type:**`OPTIONS` `{"1":"Kayako", "2":"Subscription"}` **Input type:**`INTEGER`, `FLOAT`, `BOOLEAN`, `TAGS`, `STRING`, `DATE_ABSOLUTE` or `TIME` value `n/a` **Input type:**`MULTIPLE` `{"1":"Kayako", "2":"Subscription"}` **Input type:**`RELATIVE` `{"today":"today", "currentweek":"currentweek", "currentmonth":"currentmonth"}` |

## Retrieve all definitions

GET**/api/v1/organizations/definitions.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners

### Response

```
{
    "status": 200,
    "data": [
        {
            "label": "Name",
            "field": "organizations.name",
            "type": "STRING",
            "sub_type": "",
            "group": "",
            "input_type": "STRING",
            "operators": [
                "string_contains_insensitive",
                "comparison_equalto"
            ],
            "values": "",
            "resource_type": "definition"
        },
        {
            "label": "Tags",
            "field": "tags.name",
            "type": "COLLECTION",
            "sub_type": "",
            "group": "",
            "input_type": "TAGS",
            "operators": [
                "collection_contains_insensitive",
                "collection_contains_any_insensitive",
                "collection_does_not_contain_insensitive"
            ],
            "values": "",
            "resource_type": "definition"
        },
        {
            "label": "Conversation Access",
            "field": "organizations.conversationaccess",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto"
            ],
            "values": {
                "0": "Cannot see each other's conversations",
                "1": "Can see each other's conversations"
            },
            "resource_type": "definition"
        },
        {
            "label": "Created at",
            "field": "organizations.createdat_relative_past",
            "type": "DATE_RELATIVE",
            "sub_type": "PAST_OR_PRESENT",
            "input_type": "DATE_RELATIVE",
            "group": "DATE",
            "operators": [
                "date_before_or_on"
            ],
            "values": {
                "today": "today",
                "currentweek": "currentweek",
                "currentmonth": "currentmonth",
                "currentyear": "currentyear",
                "tomorrow": "tomorrow",
                "yesterday": "yesterday",
                "lastweek": "lastweek",
                "lastmonth": "lastmonth",
                "lastyear": "lastyear",
                "last7days": "last7days",
                "last30days": "last30days",
                "last90days": "last90days",
                "last180days": "last180days",
                "last365days": "last365days"
            },
            "resource_type": "definition"
        },
        {
            "label": "Created at",
            "field": "organizations.createdat_absolute",
            "type": "DATE_ASOLUTE",
            "sub_type": "",
            "input_type": "DATE_ASOLUTE",
            "group": "DATE",
            "operators": [
                "date_is",
                "date_is_not",
                "date_after_or_on",
                "date_before_or_on"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Updated at",
            "field": "organizations.updatedat_relative_past",
            "type": "DATE_RELATIVE",
            "sub_type": "PAST_OR_PRESENT",
            "input_type": "DATE_RELATIVE",
            "group": "DATE",
            "operators": [
                "date_before_or_on"
            ],
            "values": {
                "today": "today",
                "currentweek": "currentweek",
                "currentmonth": "currentmonth",
                "currentyear": "currentyear",
                "tomorrow": "tomorrow",
                "yesterday": "yesterday",
                "lastweek": "lastweek",
                "lastmonth": "lastmonth",
                "lastyear": "lastyear",
                "last7days": "last7days",
                "last30days": "last30days",
                "last90days": "last90days",
                "last180days": "last180days",
                "last365days": "last365days"
            },
            "resource_type": "definition"
        },
        {
            "label": "Updated at",
            "field": "organizations.updatedat_absolute",
            "type": "DATE_ASOLUTE",
            "sub_type": "",
            "input_type": "DATE_ASOLUTE",
            "group": "DATE",
            "operators": [
                "date_is",
                "date_is_not",
                "date_after_or_on",
                "date_before_or_on"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Build",
            "field": "organizationfields.build",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "",
            "input_type": "INTEGER",
            "operators": [
                "comparison_equalto",
                "comparison_greaterthan",
                "comparison_lessthan"
            ],
            "values": "",
            "resource_type": "definition"
        },
        {
            "label": "Product Type",
            "field": "organizationfields.product_type",
            "type": "COLLECTION",
            "sub_type": "",
            "group": "",
            "input_type": "MULTIPLE",
            "operators": [
                "collection_contains_insensitive",
                "collection_contains_any_insensitive",
                "collection_does_not_contain_insensitive"
            ],
            "values": {
                "7": "fusion",
                "8": "engage",
                "9": "case"
            },
            "resource_type": "definition"
        }
    ],
    "resource": "definition",
    "total_count": 7
}
```

## Retrieve smart lists of organizations

POST**/api/v1/organizations/filter.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| predicates | string |  | **Examples:** {"collection_operator":"OR","collections":[{"proposition_operator":"AND","propositions":[{"field":"organizations.name","operator":"string_contains_insensitive","value":"Brewfictus"},{"field":"tags.name","operator":"collection_contains_insensitive","value":"brewfictus"}]}]} |

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "name": "Brewfictus",
            "legacy_id": null,
            "is_shared": false,
            "domains": [
                {
                    "id": 1,
                    "resource_type": "identity_domain"
                }
            ],
            "is_validated": null,
            "phone": [
                {
                    "id": 1,
                    "resource_type": "identity_phone"
                }
            ],
            "addresses": [
                {
                    "id": 1,
                    "resource_type": "contact_address"
                }
            ],
            "websites": [
                {
                    "id": 1,
                    "resource_type": "contact_website"
                }
            ],
            "pinned_notes_count": 0,
            "custom_fields": [
                {
                    "field": {
                        "id": 1,
                        "title": "Industry",
                        "key": "industry",
                        "resource_type": "organization_field",
                        "resource_url": "https://brewfictus.kayako.com/api/v1/organizations/fields/1"
                    },
                    "value": "Customer Success",
                    "resource_type": "organization_field_value"
                }
            ],
            "created_at": "2016-03-15T10:38:01+05:00",
            "updated_at": "2016-03-15T10:38:01+05:00",
            "resource_type": "organization",
            "resource_url": "https://brewfictus.kayako.com/api/v1/organizations/1"
        }
    ],
    "resource": "organization",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Retrieve all organizations

GET**/api/v1/organizations.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)
Ordered by id (ascending)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| legacy_ids | string |  | The comma separated legacy ids |

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "name": "Brewfictus",
            "legacy_id": null,
            "is_shared": false,
            "domains": [
                {
                    "id": 1,
                    "resource_type": "identity_domain"
                }
            ],
            "is_validated": null,
            "phone": [
                {
                    "id": 1,
                    "resource_type": "identity_phone"
                }
            ],
            "addresses": [
                {
                    "id": 1,
                    "resource_type": "contact_address"
                }
            ],
            "websites": [
                {
                    "id": 1,
                    "resource_type": "contact_website"
                }
            ],
            "pinned_notes_count": 0,
            "custom_fields": [
                {
                    "field": {
                        "id": 1,
                        "title": "Industry",
                        "key": "industry",
                        "resource_type": "organization_field",
                        "resource_url": "https://brewfictus.kayako.com/api/v1/organizations/fields/1"
                    },
                    "value": "Customer Success",
                    "resource_type": "organization_field_value"
                }
            ],
            "created_at": "2016-03-15T10:38:01+05:00",
            "updated_at": "2016-03-15T10:38:01+05:00",
            "resource_type": "organization",
            "resource_url": "https://brewfictus.kayako.com/api/v1/organizations/1"
        }
    ],
    "resource": "organization",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Retrieve an organization

GET**/api/v1/organizations/:id.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "name": "Brewfictus",
        "legacy_id": null,
        "is_shared": false,
        "domains": [
            {
                "id": 1,
                "resource_type": "identity_domain"
            }
        ],
        "is_validated": null,
        "phone": [
            {
                "id": 1,
                "resource_type": "identity_phone"
            }
        ],
        "addresses": [
            {
                "id": 1,
                "resource_type": "contact_address"
            }
        ],
        "websites": [
            {
                "id": 1,
                "resource_type": "contact_website"
            }
        ],
        "pinned_notes_count": 0,
        "custom_fields": [
            {
                "field": {
                    "id": 1,
                    "title": "Industry",
                    "key": "industry",
                    "resource_type": "organization_field",
                    "resource_url": "https://brewfictus.kayako.com/api/v1/organizations/fields/1"
                },
                "value": "Customer Success",
                "resource_type": "organization_field_value"
            }
        ],
        "created_at": "2016-03-15T10:38:01+05:00",
        "updated_at": "2016-03-15T10:38:01+05:00",
        "resource_type": "organization",
        "resource_url": "https://brewfictus.kayako.com/api/v1/organizations/1"
    },
    "resource": "organization"
}
```

## Retrieve members

GET**/api/v1/organizations/:id/members.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)
Ordered by full_name (ascending)

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "uuid": "11b60c25-c44c-47b8-9f48-56631cd7fa01",
            "full_name": "Simon Blackhouse",
            "legacy_id": null,
            "designation": "Community Manager",
            "is_enabled": true,
            "is_mfa_enabled": true,
            "role": {
                "id": 2,
                "resource_type": "role"
            },
            "avatar": "https://brewfictus.kayako.com/avatar/get/24ee2d81-ad95-5ae1-a07e-7ccedcdb70b8",
            "agent_case_access": "ALL",
            "organization_case_access": null,
            "organization": {
                "id": 1,
                "resource_type": "organization"
            },
            "teams": [],
            "emails": [
                {
                    "id": 1,
                    "resource_type": "identity_email"
                }
            ],
            "phones": [
                {
                    "id": 1,
                    "resource_type": "identity_phone"
                }
            ],
            "twitter": [],
            "facebook": [],
            "external_identifiers": [],
            "addresses": [
                {
                    "id": 1,
                    "resource_type": "contact_address"
                }
            ],
            "websites": [
                {
                    "id": 1,
                    "resource_type": "contact_website"
                }
            ],
            "custom_fields": [
                {
                    "field": {
                        "id": 1,
                        "resource_type": "user_field"
                    },
                    "value": "Customer Success",
                    "resource_type": "user_field_value"
                }
            ],
            "pinned_notes_count": 0,
            "locale": "en-us",
            "time_zone": null,
            "time_zone_offset": null,
            "greeting": null,
            "signature": null,
            "status_message": null,
            "last_seen_user_agent": null,
            "last_seen_ip": null,
            "last_seen_at": null,
            "last_active_at": null,
            "realtime_channel": "presence-0c1c9535b26b749f815a22cb459a4a8084be77b6ac9515751ef5a743b190bef3@v1_users_6",
            "presence_channel": "user_presence-281f395f6f51d031a6d3db3489906c98285191ebac41bb744f9323f61af63433@5c98cdaa58dd91ff1119a476e8b3e305d2906d3b",
            "password_updated_at": "2016-03-15T10:38:01+05:00",
            "avatar_updated_at": null,
            "last_logged_in_at": null,
            "last_activity_at": null,
            "created_at": "2016-03-15T10:38:01+05:00",
            "updated_at": "2016-03-15T10:38:01+05:00",
            "resource_type": "user",
            "resource_url": "https://brewfictus.kayako.com/api/v1/users/1"
        }
    ],
    "resource": "user",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Add an organization

POST**/api/v1/organizations.json**

### Information

Allowed for Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| legacy_id | string |  |  |
| domains | string |  | Comma separated domains |
| is_shared | boolean |  | **Default:**`false` |
| is_validated | boolean |  | **Default:**`false` |
| field_values | array |  | This operation will add field values with requested field keys. **Format:** field_values[field_key] = field_value field_values[field_key] = field_value **For Options:** CSV options are accepted for multi-select |
| tags | string |  | Comma separated tags |

### Response

```
{
    "status": 201,
    "data": {
        "id": 1,
        "name": "Brewfictus",
        "legacy_id": null,
        "is_shared": false,
        "domains": [
            {
                "id": 1,
                "resource_type": "identity_domain"
            }
        ],
        "is_validated": null,
        "phone": [
            {
                "id": 1,
                "resource_type": "identity_phone"
            }
        ],
        "addresses": [
            {
                "id": 1,
                "resource_type": "contact_address"
            }
        ],
        "websites": [
            {
                "id": 1,
                "resource_type": "contact_website"
            }
        ],
        "pinned_notes_count": 0,
        "custom_fields": [
            {
                "field": {
                    "id": 1,
                    "title": "Industry",
                    "key": "industry",
                    "resource_type": "organization_field",
                    "resource_url": "https://brewfictus.kayako.com/api/v1/organizations/fields/1"
                },
                "value": "Customer Success",
                "resource_type": "organization_field_value"
            }
        ],
        "created_at": "2016-03-15T10:38:01+05:00",
        "updated_at": "2016-03-15T10:38:01+05:00",
        "resource_type": "organization",
        "resource_url": "https://brewfictus.kayako.com/api/v1/organizations/1"
    },
    "resource": "organization"
}
```

## Bulk add organizations

POST**/api/v1/bulk/organizations.json**

### Information

Allowed for Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

You can insert a maximum of 200 organizations at a time

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| organizations | array |  | Array of organizations to be inserted |

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| partial_import | boolean |  | By default, even if a single record is invalid, the entire batch is dropped. However, if this parameter is set to `true`, all the records with no validation errors will be inserted while the invalid records will be returned back. |

### Request

### Response

```
{
    "status": 202,
    "data": {
        "id": 1,
        "status": "PENDING",
        "created_at": "2015-07-30T06:45:25+05:00",
        "updated_at": "2015-07-30T06:45:25+05:00",
        "resource_type": "bulk_job",
        "resource_url": "https://brewfictus.kayako.com/api/v1/jobs/1"
    },
    "resource": "job"
}
```

## Update an organization

PUT**/api/v1/organizations/:id.json**

### Information

Allowed for Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| domains | string |  | Comma separated domains |
| is_shared | boolean |  |  |
| is_validated | boolean |  |  |
| field_values | array |  | This operation will add field values with requested field keys. **Format:** field_values[field_key] = field_value field_values[field_key] = field_value **For Options:** CSV options are accepted for multi-select **WARNING:** All options must be passed. The options which are not passed will be removed. |
| tags | string |  | Comma separated tags |

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "name": "Brewfictus",
        "legacy_id": null,
        "is_shared": false,
        "domains": [
            {
                "id": 1,
                "resource_type": "identity_domain"
            }
        ],
        "is_validated": null,
        "phone": [
            {
                "id": 1,
                "resource_type": "identity_phone"
            }
        ],
        "addresses": [
            {
                "id": 1,
                "resource_type": "contact_address"
            }
        ],
        "websites": [
            {
                "id": 1,
                "resource_type": "contact_website"
            }
        ],
        "pinned_notes_count": 0,
        "custom_fields": [
            {
                "field": {
                    "id": 1,
                    "title": "Industry",
                    "key": "industry",
                    "resource_type": "organization_field",
                    "resource_url": "https://brewfictus.kayako.com/api/v1/organizations/fields/1"
                },
                "value": "Customer Success",
                "resource_type": "organization_field_value"
            }
        ],
        "created_at": "2016-03-15T10:38:01+05:00",
        "updated_at": "2016-03-15T10:38:01+05:00",
        "resource_type": "organization",
        "resource_url": "https://brewfictus.kayako.com/api/v1/organizations/1"
    },
    "resource": "organization"
}
```

## Update organizations

PUT**/api/v1/organizations.json**

### Information

Allowed for Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| is_shared | boolean |  |  |
| tags | string |  | Comma separated tags |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```

## Delete an organization

DELETE**/api/v1/organizations/:id.json**

### Information

Allowed for Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Response

```
{
    "status": 200
}
```

## Delete organizations

DELETE**/api/v1/organizations.json**

### Information

Allowed for Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```

## Posts

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| uuid | string |  |  |
| sequence | integer |  |  |
| subject | string |  |  |
| contents | string |  |  |
| creator | [User](https://developer.kayako.com/api/v1/users/users/) |  |  |
| identity | [Identity](https://developer.kayako.com/api/v1/users/identities/) |  |  |
| source_channel | [Channel](https://developer.kayako.com/api/v1/users/organizations/#Channels) |  |  |
| attachments | [Attachments](https://developer.kayako.com/api/v1/users/organizations/#attachments) |  |  |
| download_all | string |  |  |
| original | Resource |  |  |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Attachments

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| size | integer |  |  |
| width | integer |  | Only if the attachment is image |
| height | integer |  | Only if the attachment is image |
| type | string |  | Mime-type of the file |
| content_id | string |  | Content ID used for inline attachment |
| alt | string |  |  |
| url | string |  | The URL to view the attachment |
| url_download | string |  | The URL to download the attachment |
| thumbnails | [Thumbnails](https://developer.kayako.com/api/v1/users/organizations/#thumbnails) |  |  |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Thumbnails

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| size | integer |  |  |
| width | integer |  |  |
| height | integer |  |  |
| type | string |  | Mime-type of the file |
| url | string |  | The URL to view the thumbnail |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve organization posts

GET**/api/v1/organizations/:id/posts.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)
Ordered by id (descending)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| after_id | integer |  |  |
| before_id | integer |  |  |

At a time either after_id or before_id is allowed

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "uuid": "0da0b7df-9528-4e76-af3e-b7419c61f400",
            "client_id": "93a236f0-edac-4b5a-8747-14140da7d4dc",
            "subject": "Customer is using Honey - Blend. So communicate accordingly",
            "contents": "Customer is using Honey - Blend. So communicate accordingly",
            "creator": {
                "id": 1,
                "resource_type": "user"
            },
            "identity": null,
            "source_channel": null,
            "attachments": [],
            "download_all": null,
            "destination_medium": "MESSENGER",
            "source": "MAIL",
            "metadata": {
                "user_agent": "Chrome",
                "page_url": ""
            },
            "original": {
                "id": 1,
                "resource_type": "note"
            },
            "post_status": "SENT",
            "post_status_reject_type": null,
            "post_status_reject_reason": null,
            "post_status_updated_at": "2016-11-08T18:44:27+00:00",
            "created_at": "2016-02-17T08:20:18+05:00",
            "updated_at": "2016-02-17T08:20:18+05:00",
            "resource_type": "post",
            "resource_url": "https://brewfictus.kayako.com/api/v1/organizations/posts/1"
        }
    ],
    "resource": "post",
    "limit": 10,
    "total_count": 1
}
```

## Retrieve a post

GET**/api/v1/organizations/posts/:id.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "uuid": "0da0b7df-9528-4e76-af3e-b7419c61f400",
        "client_id": "93a236f0-edac-4b5a-8747-14140da7d4dc",
        "subject": "Customer is using Honey - Blend. So communicate accordingly",
        "contents": "Customer is using Honey - Blend. So communicate accordingly",
        "creator": {
            "id": 1,
            "resource_type": "user"
        },
        "identity": null,
        "source_channel": null,
        "attachments": [],
        "download_all": null,
        "destination_medium": "MESSENGER",
        "source": "MAIL",
        "metadata": {
            "user_agent": "Chrome",
            "page_url": ""
        },
        "original": {
            "id": 1,
            "resource_type": "note"
        },
        "post_status": "SENT",
        "post_status_reject_type": null,
        "post_status_reject_reason": null,
        "post_status_updated_at": "2016-11-08T18:44:27+00:00",
        "created_at": "2016-02-17T08:20:18+05:00",
        "updated_at": "2016-02-17T08:20:18+05:00",
        "resource_type": "post",
        "resource_url": "https://brewfictus.kayako.com/api/v1/organizations/posts/1"
    },
    "resource": "post"
}
```

## Fields

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| fielduuid | string |  |  |
| title | string |  |  |
| type | string |  | `TEXT`, `TEXTAREA`, `CHECKBOX`, `RADIO`, `SELECT`, `DATE`, `FILE`, `NUMERIC`, `DECIMAL`, `YESNO`, `CASCADINGSELECT`, `REGEX` |
| key | string |  |  |
| is_visible_to_customers | boolean |  | **Default:**`false` |
| customer_titles | [Field Locales](https://developer.kayako.com/api/v1/general/field_locales/) |  |  |
| is_customer_editable | boolean |  | **Default:**`false` |
| is_required_for_customers | boolean |  | **Default:**`false` |
| descriptions | [Field Locales](https://developer.kayako.com/api/v1/general/field_locales/) |  |  |
| regular_expression | string |  | The validation pattern for a field value to be deemed valid |
| sort_order | integer |  | Ordering of the field relative to other fields |
| is_enabled | boolean |  | **Default:**`true` |
| options | [Field Options](https://developer.kayako.com/api/v1/users/organizations/#Fields-options) |  | This can be set for fields of type `CHECKBOX`, `RADIO`, `SELECT`, `CASCADINGSELECT` |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve all fields

GET**/api/v1/organizations/fields.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)
Ordered by id (ascending)

Collaborators and Agents can only see the enabled fields.

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "fielduuid": "a3b79867-d038-4882-92fa-b44e079aa57b",
            "title": "Customer Success Manager",
            "type": "TEXT",
            "key": "customer_success_manager",
            "is_visible_to_customers": true,
            "customer_titles": [
                {
                    "id": 1,
                    "resource_type": "locale_field"
                },
                {
                    "id": 2,
                    "resource_type": "locale_field"
                }
            ],
            "is_customer_editable": true,
            "is_required_for_customers": true,
            "descriptions": [],
            "regular_expression": null,
            "sort_order": 1,
            "is_enabled": true,
            "options": [],
            "created_at": "2015-11-05T11:22:38+05:00",
            "updated_at": "2015-11-05T11:22:38+05:00",
            "resource_type": "organization_field",
            "resource_url": "https://brewfictus.kayako.com/api/v1/organizations/fields/1"
        }
    ],
    "resource": "organization_field",
    "total_count": 1
}
```

## Retrieve a field

GET**/api/v1/organizations/fields/:id.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "fielduuid": "a3b79867-d038-4882-92fa-b44e079aa57b",
        "title": "Customer Success Manager",
        "type": "TEXT",
        "key": "customer_success_manager",
        "is_visible_to_customers": true,
        "customer_titles": [
            {
                "id": 1,
                "resource_type": "locale_field"
            },
            {
                "id": 2,
                "resource_type": "locale_field"
            }
        ],
        "is_customer_editable": true,
        "is_required_for_customers": true,
        "descriptions": [],
        "regular_expression": null,
        "sort_order": 1,
        "is_enabled": true,
        "options": [],
        "created_at": "2015-11-05T11:22:38+05:00",
        "updated_at": "2015-11-05T11:22:38+05:00",
        "resource_type": "organization_field",
        "resource_url": "https://brewfictus.kayako.com/api/v1/organizations/fields/1"
    },
    "resource": "organization_field"
}
```

## Add a field

POST**/api/v1/organizations/fields.json**

### Information

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string |  | `TEXT`, `TEXTAREA`, `CHECKBOX`, `RADIO`, `SELECT`, `DATE`, `FILE`, `NUMERIC`, `DECIMAL`, `YESNO`, `CASCADINGSELECT`, `REGEX` |
| title | string |  |  |
| is_visible_to_customers | boolean |  | **Default:**`false` |
| customer_titles | string |  |  |
| is_customer_editable | boolean |  | **Default:**`false` |
| is_required_for_customers | boolean |  | **Default:**`false` |
| descriptions | string |  | User-defined description of this field's purpose |
| is_enabled | boolean |  | **Default:**`true` |
| regular_expression | string |  | The validation pattern for a field value to be deemed valid |
| options | string |  |  |

### Request

```
curl -X POST https://brewfictus.kayako.com/api/v1/organizations/fields \
     -d '{"title":"Customer Success Manager","type":"TEXT","is_visible_to_customers":true,"customer_titles":[{"locale":"en-us", "translation": "Customer Success Manager"}, {"locale":"fr", "translation": "Succès Client Gestionnaire"}],descriptions":[],"is_customer_editable":true,"is_required_for_customers":true,"regular_expression":null,"is_enabled":true}' \
     -H "Content-Type: application/json" \
     -u 'jordan.mitchell@brewfictus.com:jmit6#lsXo'
```

### Response

```
{
    "status": 201,
    "data": {
        "id": 1,
        "fielduuid": "a3b79867-d038-4882-92fa-b44e079aa57b",
        "title": "Customer Success Manager",
        "type": "TEXT",
        "key": "customer_success_manager",
        "is_visible_to_customers": true,
        "customer_titles": [
            {
                "id": 1,
                "resource_type": "locale_field"
            },
            {
                "id": 2,
                "resource_type": "locale_field"
            }
        ],
        "is_customer_editable": true,
        "is_required_for_customers": true,
        "descriptions": [],
        "regular_expression": null,
        "sort_order": 1,
        "is_enabled": true,
        "options": [],
        "created_at": "2015-11-05T11:22:38+05:00",
        "updated_at": "2015-11-05T11:22:38+05:00",
        "resource_type": "organization_field",
        "resource_url": "https://brewfictus.kayako.com/api/v1/organizations/fields/1"
    },
    "resource": "organization_field"
}
```

## Update a field

PUT**/api/v1/organizations/fields/:id.json**

### Information

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| title | string |  |  |
| is_visible_to_customers | boolean |  |  |
| customer_titles | string |  |  |
| is_customer_editable | boolean |  |  |
| is_required_for_customers | boolean |  |  |
| descriptions | string |  | User-defined description of this field's purpose |
| is_enabled | boolean |  |  |
| regular_expression | string |  | The validation pattern for a field value to be deemed valid |
| options | string |  |  |

### Request

```
curl -X PUT https://brewfictus.kayako.com/api/v1/organizations/fields/:id \
     -d '{"title":"Customer Success Manager","type":"TEXT","is_visible_to_customers":true,"customer_titles":[{"id":"30",locale":"en-us", "translation": "Customer Success Manager"}, {"locale":"fr", "translation": "Succès Client Gestionnaire"}],descriptions":[],"is_customer_editable":true,"is_required_for_customers":true,"regular_expression":null,"is_enabled":true}' \
     -H "Content-Type: application/json" \
     -u 'jordan.mitchell@brewfictus.com:jmit6#lsXo'
```

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "fielduuid": "a3b79867-d038-4882-92fa-b44e079aa57b",
        "title": "Customer Success Manager",
        "type": "TEXT",
        "key": "customer_success_manager",
        "is_visible_to_customers": true,
        "customer_titles": [
            {
                "id": 1,
                "resource_type": "locale_field"
            },
            {
                "id": 2,
                "resource_type": "locale_field"
            }
        ],
        "is_customer_editable": true,
        "is_required_for_customers": true,
        "descriptions": [],
        "regular_expression": null,
        "sort_order": 1,
        "is_enabled": true,
        "options": [],
        "created_at": "2015-11-05T11:22:38+05:00",
        "updated_at": "2015-11-05T11:22:38+05:00",
        "resource_type": "organization_field",
        "resource_url": "https://brewfictus.kayako.com/api/v1/organizations/fields/1"
    },
    "resource": "organization_field"
}
```

## Reorder fields

PUT**/api/v1/organizations/fields/reorder.json**

### Information

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| field_ids | string |  | The comma separated ids |

### Response

```
{
    "status": 200
}
```

## Delete a field

DELETE**/api/v1/organizations/fields/:id.json**

### Information

### Response

```
{
    "status": 200
}
```

## Delete fields

DELETE**/api/v1/organization/fields.json**

### Information

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```

## Fields options

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| fielduuid | string |  |  |
| values | [Field Locales](https://developer.kayako.com/api/v1/general/field_locales/) |  |  |
| sort_order | integer |  |  |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Reorder field options

PUT**/api/v1/organizations/fields/:id/options/reorder.json**

### Information

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| option_ids | string |  | comma separated option ids |

### Response

```
{
    "status": 200
}
```

## Delete a field option

DELETE**/api/v1/organizations/fields/:id/options/:id.json**

### Information

### Response

```
{
    "status": 200
}
```

## Delete field options

DELETE**/api/v1/organizations/fields/:id/options.json**

### Information

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```

## Fields values

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| field | [Fields](https://developer.kayako.com/api/v1/users/organizations/#Fields) |  |  |
| value | mixed |  |  |

## Retrieve field values

GET**/api/v1/organizations/:id/field/values.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)
Ordered by id (ascending)

### Response

```
{
    "status": 200,
    "data": [
        {
            "field": {
                "id": 1,
                "resource_type": "organization_field"
            },
            "value": "brewfictus",
            "resource_type": "organization_field_value"
        }
    ],
    "resource": "organization_field_value",
    "total_count": 1
}
```

## Update field values

PUT**/api/v1/organizations/:id/field/values.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| field_values | array |  | This operation will add field values with requested field keys. **Format:** field_values[field_key] = field_value field_values[field_key] = field_value **For Options:** CSV options are accepted for multi-select **WARNING:** All options must be passed. The options which are not passed will be removed. |

### Response

```
{
    "status": 200,
    "data": [
        {
            "field": {
                "id": 1,
                "resource_type": "organization_field"
            },
            "value": "brewfictus",
            "resource_type": "organization_field_value"
        }
    ],
    "resource": "organization_field_value",
    "total_count": 1
}
```

## Activities

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| activity | string |  | _An identifier for the activity_. create_organization, update_organization etc. Should contain a-Z and underscore. |
| actor | [Actor](https://developer.kayako.com/api/v1/users/organizations/#Actor) |  | _Who did it_. The user/system that carried out this activity |
| verb | string |  | _What they did_. CREATE, SHARE, JOIN, LIKE, NOTIFY etc. |
| summary | string |  |  |
| actions | [Actions](https://developer.kayako.com/api/v1/users/organizations/#Actions) |  |  |
| object | [Object](https://developer.kayako.com/api/v1/users/organizations/#Object) |  | _Activity performed on_. Case, Team, Event etc. |
| object_actor | [Actor](https://developer.kayako.com/api/v1/users/organizations/#Actor) |  | If this activity's object is itself another activity, this property specifies the original activity's actor |
| location | [Location](https://developer.kayako.com/api/v1/users/organizations/#Location) |  |  |
| place | [Place](https://developer.kayako.com/api/v1/users/organizations/#Place) |  | Where the activity was carried out |
| target | [Target](https://developer.kayako.com/api/v1/users/organizations/#Target) |  | Describes object targeted by activity |
| result | [Result](https://developer.kayako.com/api/v1/users/organizations/#Result) |  | Describes the result of the activity |
| in_reply_to | [In Reply To](https://developer.kayako.com/api/v1/users/organizations/#) |  | Identifying an object which can be considered as a response to the base object |
| participant | string |  | Describes participant of the activity |
| portal | string |  |  |
| weight | float |  | Weight decides the priority/importance of this activity |
| ip_address | string |  |  |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Actions

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| action | string |  | `CREATED`, `UPDATED`, `DELETED` |
| field | string |  |  |
| old_value | string |  |  |
| new_value | string |  |  |
| old_object | Resource |  |  |
| new_object | Resource |  |  |

## Actor

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| titile | string |  |  |
| prefix | string |  |  |
| url | string |  |  |
| full_title | string |  |  |
| image | string |  |  |
| preposition | string |  |  |
| original | Resource |  |  |

## Object

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| titile | string |  |  |
| prefix | string |  |  |
| url | string |  |  |
| full_title | string |  |  |
| image | string |  |  |
| preposition | string |  |  |
| original | Resource |  |  |

## Place

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| titile | string |  |  |
| prefix | string |  |  |
| url | string |  |  |
| full_title | string |  |  |
| image | string |  |  |
| preposition | string |  |  |
| original | Resource |  |  |

## Target

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| titile | string |  |  |
| prefix | string |  |  |
| url | string |  |  |
| full_title | string |  |  |
| image | string |  |  |
| preposition | string |  |  |
| original | Resource |  |  |

## Result

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| titile | string |  |  |
| prefix | string |  |  |
| url | string |  |  |
| full_title | string |  |  |
| image | string |  |  |
| preposition | string |  |  |
| original | Resource |  |  |

## InReplyTo

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| titile | string |  |  |
| prefix | string |  |  |
| url | string |  |  |
| full_title | string |  |  |
| image | string |  |  |
| preposition | string |  |  |
| original | Resource |  |  |

## Participant

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| titile | string |  |  |
| prefix | string |  |  |
| url | string |  |  |
| full_title | string |  |  |
| image | string |  |  |
| preposition | string |  |  |
| original | Resource |  |  |

## Location

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| city | string |  |  |
| region | string |  |  |
| region_code | string |  |  |
| area_code | string |  |  |
| time_zone | string |  |  |
| organization | string |  |  |
| net_speed | string |  | The network speed associated with the IP address. |
| country | string |  |  |
| country_code | string |  |  |
| postal_code | string |  |  |
| latitude | string |  |  |
| longitude | string |  |  |
| metro_code | string |  | The metro code associated with the IP address. These are only available for IP addresses in the US. |
| isp | string |  | The name of the Internet Service Provider associated with the IP address. |

## Retrieve all activities

GET**/api/v1/organizations/:id/activities.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)
Ordered by id (ascending)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| minimum_weight | float |  | Filter activities by their minimum weight |
| since | timestamp |  | Filter activities newer than specified date |
| until | timestamp |  | Filter activities older than specified date |
| sort_order | string |  | `ASC`, `DESC` **Default:**`DESC` |

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 12,
            "activity": "create_case",
            "actor": {
                "name": "user",
                "title": "Simon Blackhouse",
                "prefix": "@",
                "url": "https://brewfictus.kayako.com/user/1",
                "full_title": "Simon Blackhouse",
                "image": "",
                "preposition": null,
                "original": {
                    "id": 1,
                    "resource_type": "user"
                },
                "resource_type": "activity_actor"
            },
            "verb": "create",
            "summary": "<@https://brewfictus.kayako.com/user/1|Phoebe Todd> created <https://brewfictus.kayako.com/case/view/1|Atmosphere Coffee, Inc annual maintenance>",
            "actions": [],
            "object": {
                "id": 1,
                "resource_type": "case"
            },
            "object_actor": null,
            "location": null,
            "place": null,
            "target": null,
            "result": null,
            "in_reply_to": null,
            "participant": null,
            "portal": "API",
            "weight": 0.8,
            "ip_address": null,
            "created_at": "2015-07-27T11:35:09+05:00",
            "resource_type": "activity"
        }
    ],
    "resource": "activity",
    "limit": 10,
    "total_count": 1
}
```

## Domains

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| domain | string |  |  |
| is_primary | boolean |  | This returns true for the primary domain of the user **Default:**`false` |
| is_validated | boolean |  | Specifies if the domain is validated **Default:**`false` |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve all domains

GET**/api/v1/identities/domains.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)
Ordered by id (ascending)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| organization_id | integer |  | The id of the [Organization](https://developer.kayako.com/api/v1/users/organizations/) |

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "domain": "brewfictus.com",
            "is_primary": true,
            "is_validated": false,
            "created_at": "2016-03-15T10:38:01+05:00",
            "updated_at": "2016-03-15T10:38:01+05:00",
            "resource_type": "identity_domain",
            "resource_url": "https://brewfictus.kayako.com/api/v1/identities/domains/1"
        }
    ],
    "resource": "identity_domain",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Retrieve a domain

GET**/api/v1/identities/domains/:id.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Response

## Add a domain

POST**/api/v1/identities/domains.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| organization_id | integer |  | The id of the [Organization](https://developer.kayako.com/api/v1/users/organizations/) |
| domain | string |  |  |
| is_primary | boolean |  | **Default:**`False` |
| is_validated | boolean |  | Applicable for the role type `AGENT`, `ADMIN`, `OWNER` **Default:**`false` |

### Response

## Update a domain

PUT**/api/v1/identities/domains/:id.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| is_primary | boolean |  |  |
| is_validated | boolean |  |  |

### Response

## Delete domain

DELETE**/api/v1/identities/domains/:id.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Response

```
{
    "status": 200
}
```

## Delete domains

DELETE**/api/v1/identities/domains.json**

### Information

Allowed for Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```

## Notes

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| body_text | string |  |  |
| body_html | string |  |  |
| is_pinned | boolean |  | **Default:**`false` |
| pinned_by | [User](https://developer.kayako.com/api/v1/users/users/) |  |  |
| user | [User](https://developer.kayako.com/api/v1/users/users/) |  |  |
| attachments | [Attachments](https://developer.kayako.com/api/v1/users/organizations/#Attachments) |  |  |
| download_all | string |  | Download all attachment as zip |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Attachments

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| size | integer |  |  |
| width | integer |  | Only if the attachment is image |
| height | integer |  | Only if the attachment is image |
| type | string |  | Mime-type of the file |
| content_id | string |  | Content ID used for inline attachment |
| alt | string |  |  |
| url | string |  | The URL to view the attachment |
| url_download | string |  | The URL to download the attachment |
| thumbnails | [Thumbnails](https://developer.kayako.com/api/v1/users/organizations/#Thumbnails) |  |  |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Thumbnails

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| size | integer |  |  |
| width | integer |  |  |
| height | integer |  |  |
| type | string |  | Mime-type of the file |
| url | string |  | The URL to view the thumbnail |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve all notes

GET**/api/v1/organizations/:id/notes.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)
Ordered by created_at (descending)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| is_pinned | boolean |  |  |

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "body_text": "Customer is using Honey - Blend. So communicate accordingly",
            "body_html": null,
            "is_pinned": true,
            "pinned_by": {
                "id": 1,
                "resource_type": "user"
            },
            "user": {
                "id": 1,
                "resource_type": "user"
            },
            "attachments": [],
            "download_all": null,
            "created_at": "2016-02-17T08:20:18+05:00",
            "updated_at": "2016-02-17T08:20:18+05:00",
            "resource_type": "note",
            "resource_url": "https://brewfictus.kayako.com/api/v1/organizations/1/notes/1"
        }
    ],
    "resource": "note",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Retrieve a note

GET**/api/v1/organizations/:id/notes/:id.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "body_text": "Customer is using Honey - Blend. So communicate accordingly",
        "body_html": null,
        "is_pinned": true,
        "pinned_by": {
            "id": 1,
            "resource_type": "user"
        },
        "user": {
            "id": 1,
            "resource_type": "user"
        },
        "attachments": [],
        "download_all": null,
        "created_at": "2016-02-17T08:20:18+05:00",
        "updated_at": "2016-02-17T08:20:18+05:00",
        "resource_type": "note",
        "resource_url": "https://brewfictus.kayako.com/api/v1/organizations/1/notes/1"
    },
    "resource": "note"
}
```

## Add a note

POST**/api/v1/organizations/:id/notes.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| contents | string |  |  |
| is_html | boolean |  | If set to true then system will parse the contents through the purify service and render them **Default:**`false` |
| files[] | array |  | File Upload multipart/form-data |
| attachment_file_ids | [CSV](https://developer.kayako.com/api/v1/users/organizations/#) |  |  |

### Response

```
{
    "status": 201,
    "data": {
        "id": 1,
        "body_text": "Customer is using Honey - Blend. So communicate accordingly",
        "body_html": null,
        "is_pinned": true,
        "pinned_by": {
            "id": 1,
            "resource_type": "user"
        },
        "user": {
            "id": 1,
            "resource_type": "user"
        },
        "attachments": [],
        "download_all": null,
        "created_at": "2016-02-17T08:20:18+05:00",
        "updated_at": "2016-02-17T08:20:18+05:00",
        "resource_type": "note",
        "resource_url": "https://brewfictus.kayako.com/api/v1/organizations/1/notes/1"
    },
    "resource": "note"
}
```

## Update a note

PUT**/api/v1/organizations/:id/notes/:id.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| is_pinned | boolean |  | If set to true then it wil appear as a pinned in the organization, user and conversation timelines. |

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "body_text": "Customer is using Honey - Blend. So communicate accordingly",
        "body_html": null,
        "is_pinned": true,
        "pinned_by": {
            "id": 1,
            "resource_type": "user"
        },
        "user": {
            "id": 1,
            "resource_type": "user"
        },
        "attachments": [],
        "download_all": null,
        "created_at": "2016-02-17T08:20:18+05:00",
        "updated_at": "2016-02-17T08:20:18+05:00",
        "resource_type": "note",
        "resource_url": "https://brewfictus.kayako.com/api/v1/organizations/1/notes/1"
    },
    "resource": "note"
}
```

## Tags

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |

## Add tags

POST**/api/v1/organizations/:id/tags.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| tags | string |  | Comma separated tags |

### Response

```
{
    "status": 201,
    "data": [
        {
            "id": 1,
            "name": "important",
            "resource_type": "tag"
        }
    ],
    "resource": "tag",
    "total_count": 1
}
```

## Replace tags

PUT**/api/v1/organizations/:id/tags.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| tags | string |  | Comma separated tags |

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "name": "important",
            "resource_type": "tag"
        }
    ],
    "resource": "tag",
    "total_count": 1
}
```

## Remove tags

DELETE**/api/v1/organizations/:id/tags.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| tags | string |  | Comma separated tags |

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "name": "important",
            "resource_type": "tag"
        }
    ],
    "resource": "tag",
    "total_count": 1
}
```




### Profile

Title: Profile - Users | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/users/profile/

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   CORE
4.   USERS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| full_name | string |  |  |
| designation | string |  |  |
| is_otp_enabled | boolean |  |  |
| avatar | string |  |  |
| organization | [Organization](https://developer.kayako.com/api/v1/users/organizations/) |  |  |
| teams | [Teams](https://developer.kayako.com/api/v1/users/teams) |  |  |
| emails | [Emails](https://developer.kayako.com/api/v1/users/identities/#Emails) |  |  |
| phones | [Phones](https://developer.kayako.com/api/v1/users/identities/#Phones) |  |  |
| twitter | [Twitter](https://developer.kayako.com/api/v1/users/identities/#Twitter-accounts) |  |  |
| facebook | [Facebook](https://developer.kayako.com/api/v1/users/identities/#Facebook-accounts) |  |  |
| external_identifiers | [External Identifiers](https://developer.kayako.com/api/v1/users/identities/#External-identifiers) |  |  |
| addresses | [Addresses](https://developer.kayako.com/api/v1/users/contacts/#Addresses) |  |  |
| websites | [Websites](https://developer.kayako.com/api/v1/users/contacts/#Websites) |  |  |
| custom_fields | Fields |  |  |
| locale | [Locale](https://developer.kayako.com/api/v1/general/locales/) |  |  |
| time_zone | string |  |  |
| greeting | string |  |  |
| signature | string |  |  |
| status_message | string |  |  |
| last_login_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve profile

GET**/api/v1/profile.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "full_name": "Phoebe Todd",
        "designation": null,
        "is_otp_enabled": false,
        "avatar": "https://brewfictus.kayako.com/avatar/get/7b3b3fea-b6ba-55c8-8c72-31ba4fb52e78",
        "agent_case_access": "ALL",
        "organization_case_access": null,
        "organization": {
            "id": 1,
            "resource_type": "organization"
        },
        "teams": [
            {
                "id": 1,
                "legacy_id": null,
                "resource_type": "team"
            }
        ],
        "emails": [
            {
                "id": 1,
                "resource_type": "identity_email"
            }
        ],
        "phones": [],
        "twitter": [],
        "facebook": [],
        "external_identifiers": [],
        "addresses": [],
        "websites": [],
        "custom_fields": [
            {
                "field": {
                    "id": 1,
                    "resource_type": "user_field"
                },
                "value": "",
                "resource_type": "user_field_value"
            }
        ],
        "locale": "en-us",
        "time_zone": null,
        "time_zone_offset": null,
        "greeting": null,
        "signature": null,
        "status_message": null,
        "last_seen_user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.125 Safari/537.36",
        "last_seen_ip": "89.76.11.90",
        "last_login_at": "2015-08-04T06:20:32+05:00",
        "created_at": "2015-08-04T05:16:39+05:00",
        "updated_at": "2015-08-04T06:38:33+05:00",
        "resource_type": "profile",
        "resource_url": "https://brewfictus.kayako.com/api/v1/profile"
    },
    "resource": "profile"
}
```

## Update profile

PUT**/api/v1/profile.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| full_name | string |  |  |
| designation | string |  |  |
| locale_id | integer |  | [Locales](https://developer.kayako.com/api/v1/general/locales) |
| time_zone | string |  |  |
| signature | string |  |  |
| field_values | string |  |  |
| avatar | multipart/form-data |  |  |

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "full_name": "Phoebe Todd",
        "designation": null,
        "is_otp_enabled": false,
        "avatar": "https://brewfictus.kayako.com/avatar/get/7b3b3fea-b6ba-55c8-8c72-31ba4fb52e78",
        "agent_case_access": "ALL",
        "organization_case_access": null,
        "organization": {
            "id": 1,
            "resource_type": "organization"
        },
        "teams": [
            {
                "id": 1,
                "legacy_id": null,
                "resource_type": "team"
            }
        ],
        "emails": [
            {
                "id": 1,
                "resource_type": "identity_email"
            }
        ],
        "phones": [],
        "twitter": [],
        "facebook": [],
        "external_identifiers": [],
        "addresses": [],
        "websites": [],
        "custom_fields": [
            {
                "field": {
                    "id": 1,
                    "resource_type": "user_field"
                },
                "value": "",
                "resource_type": "user_field_value"
            }
        ],
        "locale": "en-us",
        "time_zone": null,
        "time_zone_offset": null,
        "greeting": null,
        "signature": null,
        "status_message": null,
        "last_seen_user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.125 Safari/537.36",
        "last_seen_ip": "89.76.11.90",
        "last_login_at": "2015-08-04T06:20:32+05:00",
        "created_at": "2015-08-04T05:16:39+05:00",
        "updated_at": "2015-08-04T06:38:33+05:00",
        "resource_type": "profile",
        "resource_url": "https://brewfictus.kayako.com/api/v1/profile"
    },
    "resource": "profile"
}
```

## Delete an avatar

DELETE**/api/v1/profile/avatar.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

### Response

```
{
    "status": 200
}
```

## Change password

PUT**/api/v1/profile/password.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| password | string |  |  |
| new_password | string |  |  |

### Response

```
{
    "status": 200
}
```

## Validate email

PUT**/api/v1/profile/verify.json**

### Information

Allowed for Public

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| hash | string |  |  |

### Response

```
{
    "status": 200
}
```

## Emails

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| email | string |  |  |
| is_primary | boolean |  | **Default:**`false` |
| is_validated | boolean |  | **Default:**`false` |
| is_notification_enabled | boolean |  | **Default:**`false` |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve all emails

GET**/api/v1/profile/identities/emails.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners
Ordered by is_primary, updated_at (descending)

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "email": "simon.blackhouse@brewfictus.com",
            "is_primary": true,
            "is_validated": true,
            "is_notification_enabled": false,
            "created_at": "2016-04-22T11:52:04+00:00",
            "updated_at": "2016-04-22T11:52:30+00:00",
            "resource_type": "identity_email",
            "resource_url": "https://brewfictus.kayako.com/api/v1/identities/emails/1"
        }
    ],
    "resource": "identity_email",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Retrieve an email

GET**/api/v1/profile/identities/emails/:id.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "email": "simon.blackhouse@brewfictus.com",
        "is_primary": true,
        "is_validated": true,
        "is_notification_enabled": false,
        "created_at": "2016-04-22T11:52:04+00:00",
        "updated_at": "2016-04-22T11:52:30+00:00",
        "resource_type": "identity_email",
        "resource_url": "https://brewfictus.kayako.com/api/v1/identities/emails/1"
    },
    "resource": "identity_email"
}
```

## Add an email

POST**/api/v1/profile/identities/emails.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| email | string |  |  |
| is_primary | boolean |  | **Default:**`false` |
| is_notification_enabled | boolean |  | **Default:**`false` |

### Response

```
{
    "status": 201,
    "data": {
        "id": 1,
        "email": "simon.blackhouse@brewfictus.com",
        "is_primary": true,
        "is_validated": true,
        "is_notification_enabled": false,
        "created_at": "2016-04-22T11:52:04+00:00",
        "updated_at": "2016-04-22T11:52:30+00:00",
        "resource_type": "identity_email",
        "resource_url": "https://brewfictus.kayako.com/api/v1/identities/emails/1"
    },
    "resource": "identity_email"
}
```

## Mark as primary

PUT**/api/v1/profile/identities/emails/:id/primary.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "email": "simon.blackhouse@brewfictus.com",
        "is_primary": true,
        "is_validated": true,
        "is_notification_enabled": false,
        "created_at": "2016-04-22T11:52:04+00:00",
        "updated_at": "2016-04-22T11:52:30+00:00",
        "resource_type": "identity_email",
        "resource_url": "https://brewfictus.kayako.com/api/v1/identities/emails/1"
    },
    "resource": "identity_email"
}
```

## Send a verification email

PUT**/api/v1/profile/identities/emails/:id/verification.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "email": "simon.blackhouse@brewfictus.com",
        "is_primary": true,
        "is_validated": true,
        "is_notification_enabled": false,
        "created_at": "2016-04-22T11:52:04+00:00",
        "updated_at": "2016-04-22T11:52:30+00:00",
        "resource_type": "identity_email",
        "resource_url": "https://brewfictus.kayako.com/api/v1/identities/emails/1"
    },
    "resource": "identity_email"
}
```

## Delete an email

DELETE**/api/v1/profile/identities/emails/:id.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

### Response

```
{
    "status": 200
}
```

## Delete emails

DELETE**/api/v1/profile/identities/emails.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```

## Phones

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| number | string |  |  |
| type | string |  | `NONE`, `HOME`, `WORK`, `MOBILE` **Default:**`NONE` |
| is_primary | boolean |  | **Default:**`false` |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve all phones

GET**/api/v1/profile/identities/phones.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners
Ordered by is_primary, updated_at (descending)

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 3,
            "number": "+14515550197",
            "is_primary": true,
            "is_validated": false,
            "created_at": "2015-09-11T07:05:59+05:00",
            "updated_at": "2015-09-11T07:05:59+05:00",
            "resource_type": "identity_phone",
            "resource_url": "https://brewfictus.kayako.com/api/v1/profile/identities/phones/3"
        }
    ],
    "resource": "identity_phone",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Retrieve a phone

GET**/api/v1/profile/identities/phones/:id.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

### Response

```
{
    "status": 200,
    "data": {
        "id": 3,
        "number": "+14515550197",
        "is_primary": true,
        "is_validated": false,
        "created_at": "2015-09-11T07:05:59+05:00",
        "updated_at": "2015-09-11T07:05:59+05:00",
        "resource_type": "identity_phone",
        "resource_url": "https://brewfictus.kayako.com/api/v1/profile/identities/phones/3"
    },
    "resource": "identity_phone"
}
```

## Add a phone

POST**/api/v1/profile/identities/phones.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| number | string |  |  |
| type | string |  | `NONE`, `HOME`, `WORK`, `MOBILE` **Default:**`NONE` |
| is_primary | boolean |  | **Default:**`false` |

### Response

```
{
    "status": 201,
    "data": {
        "id": 3,
        "number": "+14515550197",
        "is_primary": true,
        "is_validated": false,
        "created_at": "2015-09-11T07:05:59+05:00",
        "updated_at": "2015-09-11T07:05:59+05:00",
        "resource_type": "identity_phone",
        "resource_url": "https://brewfictus.kayako.com/api/v1/profile/identities/phones/3"
    },
    "resource": "identity_phone"
}
```

## Mark as primary

PUT**/api/v1/profile/identities/phones/:id/primary.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

### Response

```
{
    "status": 200,
    "data": {
        "id": 3,
        "number": "+14515550197",
        "is_primary": true,
        "is_validated": false,
        "created_at": "2015-09-11T07:05:59+05:00",
        "updated_at": "2015-09-11T07:09:06+05:00",
        "resource_type": "identity_phone",
        "resource_url": "https://brewfictus.kayako.com/api/v1/profile/identities/phones/3"
    },
    "resource": "identity_phone"
}
```

## Delete a phone

DELETE**/api/v1/profile/identities/phones/:id.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

### Response

```
{
    "status": 200
}
```

## Delete phones

DELETE**/api/v1/profile/identities/phones.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```

## Twitter accounts

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| twitter_id | string |  |  |
| full_name | string |  |  |
| screen_name | string |  |  |
| follower_count | integer |  |  |
| description | string |  |  |
| url | string |  |  |
| location | string |  |  |
| profile_image_url | string |  |  |
| locale | string |  |  |
| is_verified | boolean |  | **Default:**`false` |
| is_primary | boolean |  | **Default:**`false` |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve all accounts

GET**/api/v1/profile/identities/twitter.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners
Ordered by is_primary, updated_at (descending)

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "twitter_id": "3156012171",
            "full_name": "Phoebe Todd",
            "screen_name": "phoebetodd",
            "follower_count": 0,
            "description": null,
            "url": null,
            "location": null,
            "profile_image_url": null,
            "locale": "en",
            "is_verified": false,
            "is_primary": false,
            "is_validated": false,
            "created_at": "2015-07-25T15:02:02+05:00",
            "updated_at": "2015-07-25T15:02:02+05:00",
            "resource_type": "identity_twitter",
            "resource_url": "https://brewfictus.kayako.com/api/v1/identities/twitter/1"
        }
    ],
    "resource": "identity_twitter",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Retrieve an account

GET**/api/v1/profile/identities/twitter/:id.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "twitter_id": "3156012171",
        "full_name": "Phoebe Todd",
        "screen_name": "phoebetodd",
        "follower_count": 0,
        "description": null,
        "url": null,
        "location": null,
        "profile_image_url": null,
        "locale": "en",
        "is_verified": false,
        "is_primary": false,
        "is_validated": false,
        "created_at": "2015-07-25T15:02:02+05:00",
        "updated_at": "2015-07-25T15:02:02+05:00",
        "resource_type": "identity_twitter",
        "resource_url": "https://brewfictus.kayako.com/api/v1/identities/twitter/1"
    },
    "resource": "identity_twitter"
}
```

## Mark as primary

PUT**/api/v1/profile/identities/twitter/:id/primary.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "twitter_id": "3156012171",
        "full_name": "Phoebe Todd",
        "screen_name": "phoebetodd",
        "follower_count": 0,
        "description": null,
        "url": null,
        "location": null,
        "profile_image_url": null,
        "locale": "en",
        "is_verified": false,
        "is_primary": false,
        "is_validated": false,
        "created_at": "2015-07-25T15:02:02+05:00",
        "updated_at": "2015-07-25T15:02:02+05:00",
        "resource_type": "identity_twitter",
        "resource_url": "https://brewfictus.kayako.com/api/v1/identities/twitter/1"
    },
    "resource": "identity_twitter"
}
```

## Delete an account

DELETE**/api/v1/profile/identities/twitter/:id.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

### Response

```
{
    "status": 200
}
```

## Delete accounts

DELETE**/api/v1/profile/identities/twitter.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```

## Facebook accounts

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| facebook_id | string |  |  |
| user_name | string |  |  |
| full_name | string |  |  |
| email | string |  |  |
| bio | string |  |  |
| birth_date | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| website | string |  |  |
| profile_url | string |  |  |
| locale | string |  |  |
| is_verified | boolean |  | **Default:**`false` |
| is_primary | boolean |  | **Default:**`false` |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve all accounts

GET**/api/v1/profile/identities/facebook.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners
Ordered by is_primary, updated_at (descending)

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "facebook_id": "1407638772888867",
            "user_name": null,
            "full_name": "Jordan Mitchell",
            "email": null,
            "bio": null,
            "birth_date": null,
            "website": null,
            "profile_url": null,
            "locale": null,
            "is_verified": false,
            "is_primary": false,
            "is_validated": false,
            "created_at": "2015-07-25T17:47:14+05:00",
            "updated_at": "2015-07-25T17:47:14+05:00",
            "resource_type": "identity_facebook",
            "resource_url": "https://brewfictus.kayako.com/api/v1/identities/facebook/1"
        }
    ],
    "resource": "identity_facebook",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Retrieve an account

GET**/api/v1/profile/identities/facebook/:id.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "facebook_id": "1407638772888867",
        "user_name": null,
        "full_name": "Jordan Mitchell",
        "email": null,
        "bio": null,
        "birth_date": null,
        "website": null,
        "profile_url": null,
        "locale": null,
        "is_verified": false,
        "is_primary": false,
        "is_validated": false,
        "created_at": "2015-07-25T17:47:14+05:00",
        "updated_at": "2015-07-25T17:47:14+05:00",
        "resource_type": "identity_facebook",
        "resource_url": "https://brewfictus.kayako.com/api/v1/identities/facebook/1"
    },
    "resource": "identity_facebook"
}
```

## Mark as primary

PUT**/api/v1/profile/identities/facebook/:id/primary.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "facebook_id": "1407638772888867",
        "user_name": null,
        "full_name": "Jordan Mitchell",
        "email": null,
        "bio": null,
        "birth_date": null,
        "website": null,
        "profile_url": null,
        "locale": null,
        "is_verified": false,
        "is_primary": false,
        "is_validated": false,
        "created_at": "2015-07-25T17:47:14+05:00",
        "updated_at": "2015-07-25T17:47:14+05:00",
        "resource_type": "identity_facebook",
        "resource_url": "https://brewfictus.kayako.com/api/v1/identities/facebook/1"
    },
    "resource": "identity_facebook"
}
```

## Delete an account

DELETE**/api/v1/profile/identities/facebook/:id.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

### Response

```
{
    "status": 200
}
```

## Delete accounts

DELETE**/api/v1/profile/identities/facebook.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```

## Two Factor

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| recovery_codes | array |  | When two factor authentication is enabled/updated, a set of 10 recovery codes is generated to be used if authenticator app is unavailable for some reason. |

## Token

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| token | string |  |  |
| qr_code | string |  | base64 encoded image data |
| qr_code_type | string |  | image type e.g. "image/png" |

## Generate a token

GET**/api/v1/profile/twofactor.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

### Response

```
{
    "status": 200,
    "data": {
        "token": "JfZgjFdKaK0ZyeLCjDt3OXdSg3G5dKY5LDGGQPsWKtzHNNy1nMZ+y5ur",
        "qr_code": "iVBORw0KGgoAAAANSUhEUgAAAZoAAAGaAQMAAAAMyBcgAAAABlBMVEX///8AAABVwtN+AAAACXBIWXMAAA7EAAAOxAGVKw4bAAACEUlEQVR4nO2ZTW6EMAyFLXGAORJX50gcAMlN7GeHUNSq6i5+b8EQ4i+zsfwXEYqiKIqiqP9IoUtkP/uHj6rsGo++dB2EikC++FwNP7e2Z9CJjba8JjtCBaDuKLYHv+lW5jx+Rj+tORmhepBZDYfyN0KFIVjZ13AjnEGoFORWcBnPMmblpr/lJ0LLQVAEkW+PMCBUBHqo7fWSoz1aLfIIJ4RKQPCRT/iSay5DdlsSqgG5dt/LN8UZ+PYeWAgtCfmeeN2x+V5znml+0TX9B6GFIdSf3d73whQzDULVIA8Yu214RokQk6nGvIpQFcirzvtQU/V+ht+NPAtTQgtDnmWcxBkmtKwSpBCqAY0WBHVHppXdYwqaV0JVIHjQGGtJNChj7nnIU4QWhnDxITJKjvCqLavT7dnnEloXsqiR1QZ0SmYefctPhNaFovsY88xwmT2Cza2NJVQAwhW6xhVIehBa1qhPCFWBNFtWvRUaUYm+pxpCK0O2GC2I5Zbb1GL0rYSqQBFTFF1KhpiB+zdCdaCnQcYUNR3fAwuhZaEJv24HwasEtQihKpBCyChehphBNiiv5SihZSEzyGEWZpwT/pZqCC0Mect6pUNpjDOmVCNCqBx05NQCBUkMwUewIVQLsqX3JpdPNyLiyCxCS0P2c/MgzLFisDHeCNWAIJSjghlndil+k/pzDUtoJYiiKIqiKOrv+gJ4PgUravidagAAAABJRU5ErkJggg==",
        "qr_code_type": "image/png"
    },
    "resource": "twofactor_token"
}
```

## Enable two factor

POST**/api/v1/profile/twofactor.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| token | string |  | Token linked with the QR Code received from api |
| otp | integer |  | Generated by authenticator application after scanning QR Code |

### Response

```
{
    "status": 201,
    "data": {
        "recovery_codes": [
            "3yqQQ ALyxE Xuhb6",
            "mKBO6 NsAim LrbCA",
            "HYE7r KfC1x SSn7D",
            "Dr0Ew GHq05 1N5Wp",
            "3rUez qNW1F Mod14",
            "pw6A1 h3DcQ 5dQRo",
            "hHkZ0 hNxst jg77q",
            "UcckF HGJ2G qiqlJ",
            "jT4wj HE7cn Oq59a",
            "Alyat iphqt dZMh4"
        ]
    },
    "resource": "twofactor_recoverycodes"
}
```

## Update a token

PUT**/api/v1/profile/twofactor.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| token | string |  | Token linked with the QR Code received from api |
| otp | integer |  | Generated by authenticator application after scanning QR Code |

### Response

```
{
    "status": 200,
    "data": {
        "recovery_codes": [
            "ZZK1s C7VmS AwHLA",
            "ST3bc SMBWW Y7h5F",
            "0aYVN 36AX2 1hcuq",
            "bJn6X 05qvG XdIgk",
            "A7pDg OZ97i 88ueo",
            "xIelG s0mau mw6HO",
            "QGWvg 644Ys obOeg",
            "cwd3u G9Pcn ilYj3",
            "B0qho jWqwz lXL4A",
            "zuxsO QK81q R1lJI"
        ]
    },
    "resource": "twofactor_recoverycodes"
}
```

## Fields

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| fielduuid | string |  |  |
| title | string |  |  |
| type | string |  |  |
| key | string |  |  |
| is_visible_to_customers | boolean |  |  |
| customer_title | [Field Locales](https://developer.kayako.com/api/v1/general/field_locales/) |  |  |
| is_customer_editable | boolean |  |  |
| is_required_for_customers | boolean |  |  |
| description | string |  |  |
| regular_expression | string |  |  |
| sort_order | integer |  | **Default:**`false` |
| is_enabled | boolean |  | **Default:**`false` |
| options | [Options](https://developer.kayako.com/api/v1/users/fields/#Options) |  |  |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve all fields

GET**/api/v1/profile/fields.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners
Ordered by sort_order (ascending)

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "fielduuid": "2ae7907f-8d83-4ffe-875c-f53c6c51571c",
        "title": "Industry",
        "type": "TEXT",
        "key": "industry",
        "is_visible_to_customers": true,
        "customer_titles": [
            {
                "id": 1,
                "resource_type": "locale_field"
            },
            {
                "id": 2,
                "resource_type": "locale_field"
            }
        ],
        "is_customer_editable": true,
        "is_required_for_customers": true,
        "descriptions": [],
        "regular_expression": null,
        "sort_order": 1,
        "is_enabled": true,
        "options": [],
        "created_at": "2015-11-20T06:22:57+05:00",
        "updated_at": "2015-11-20T06:22:57+05:00",
        "resource_type": "profile_field",
        "resource_url": "https://brewfictus.kayako.com/api/v1/profile/fields/1"
    },
    "resource": "profile_field"
}
```

## Retrieve a field

GET**/api/v1/profile/fields/:id.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "fielduuid": "2ae7907f-8d83-4ffe-875c-f53c6c51571c",
            "title": "Industry",
            "type": "TEXT",
            "key": "industry",
            "is_visible_to_customers": true,
            "customer_titles": [
                {
                    "id": 1,
                    "resource_type": "locale_field"
                },
                {
                    "id": 2,
                    "resource_type": "locale_field"
                }
            ],
            "is_customer_editable": true,
            "is_required_for_customers": true,
            "descriptions": [],
            "regular_expression": null,
            "sort_order": 1,
            "is_enabled": true,
            "options": [],
            "created_at": "2015-11-20T06:22:57+05:00",
            "updated_at": "2015-11-20T06:22:57+05:00",
            "resource_type": "profile_field",
            "resource_url": "https://brewfictus.kayako.com/api/v1/profile/fields/1"
        }
    ],
    "resource": "profile_field",
    "total_count": 2
}
```




### Roles

Title: Roles - Users | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/users/roles/

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   CORE
4.   USERS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| title | string |  |  |
| type | string |  | `OWNER`, `ADMIN`, `AGENT`, `COLLABORATOR`, `CUSTOMER` |
| is_system | boolean |  |  |
| agent_case_access | string |  | `SELF`, `TEAMS`, `ALL` Only applicable for the role type `OWNER`, `ADMIN`, `AGENT`, `COLLABORATOR` **Default:**`ALL` |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve all roles

GET**/api/v1/roles.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)
Ordered by id (ascending)

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "title": "Administrator",
            "type": "ADMIN",
            "is_system": true,
            "agent_case_access": "ALL",
            "created_at": "2015-07-24T04:21:36+05:00",
            "updated_at": "2015-07-24T04:21:36+05:00",
            "resource_type": "role",
            "resource_url": "https://brewfictus.kayako.com/api/v1/roles/1"
        }
    ],
    "resource": "role",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Retrieve a role

GET**/api/v1/roles/:id.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "title": "Administrator",
        "type": "ADMIN",
        "is_system": true,
        "agent_case_access": "ALL",
        "created_at": "2015-07-24T04:21:36+05:00",
        "updated_at": "2015-07-24T04:21:36+05:00",
        "resource_type": "role",
        "resource_url": "https://brewfictus.kayako.com/api/v1/roles/1"
    },
    "resource": "role"
}
```

## Add a role

POST**/api/v1/roles.json**

### Information

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| title | string |  |  |
| type | string |  | `ADMIN`, `AGENT` |
| agent_case_access | string |  | `SELF`, `TEAMS`, `ALL` **Default:**`ALL` |

### Response

```
{
    "status": 201,
    "data": {
        "id": 5,
        "title": "Manager",
        "type": "AGENT",
        "is_system": true,
        "agent_case_access": "ALL",
        "created_at": "2015-07-24T05:46:45+05:00",
        "updated_at": "2015-07-24T05:46:45+05:00",
        "resource_type": "role",
        "resource_url": "https://brewfictus.kayako.com/api/v1/roles/5"
    },
    "resource": "role"
}
```

## Update a role

PUT**/api/v1/roles/:id.json**

### Information

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| title | string |  |  |
| agent_case_access | string |  | `SELF`, `TEAMS`, `ALL` |

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "title": "Floor Manager",
        "type": "ADMIN",
        "is_system": true,
        "agent_case_access": "ALL",
        "created_at": "2015-07-24T04:21:36+05:00",
        "updated_at": "2015-07-24T05:49:22+05:00",
        "resource_type": "role",
        "resource_url": "https://brewfictus.kayako.com/api/v1/roles/1"
    },
    "resource": "role"
}
```

## Delete a role

DELETE**/api/v1/roles/:id.json**

### Information

### Response

```
{
    "status": 200
}
```

## Delete roles

DELETE**/api/v1/roles.json**

### Information

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | comma separated phrases |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```

## Permissions

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| value | boolean |  |  |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve all permissions

GET**/api/v1/roles/:id/permissions.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners
Scope[configuration](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)
Ordered by id (ascending)

Customers can view their own permissions.

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 177,
            "name": "address.manage",
            "value": true,
            "created_at": "2016-04-22T08:51:23+00:00",
            "updated_at": "2016-04-22T08:51:23+00:00",
            "resource_type": "permission",
            "resource_url": "https://brewfictus.kayako.com/api/v1/roles/1/permissions/177"
        }
    ],
    "resource": "permission",
    "total_count": 1
}
```

## Update permissions

PUT**/api/v1/roles/:id/permissions.json**

### Information

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| permission |  |  | We accept the key-value pair to add a field value. **Example:** ['team.member.create' => 0 or 1, 'team.member.delete' => 0 or 1] |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```




### Tags

Title: Tags - Users | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/users/tags/

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   CORE
4.   USERS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |

## Add tags

POST**/api/v1/users/:id/tags.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| tags | string |  | The comma separated values |

### Response

```
{
    "status": 201,
    "data": [
        {
            "id": 1,
            "name": "important",
            "resource_type": "tag"
        }
    ],
    "resource": "tag",
    "total_count": 1
}
```

## Replace tags

PUT**/api/v1/users/:id/tags.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| tags | string |  | The comma separated values |

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "name": "important",
            "resource_type": "tag"
        }
    ],
    "resource": "tag",
    "total_count": 1
}
```

## Remove tags

DELETE**/api/v1/users/:id/tags.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| tags | string |  | The comma separated values |

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "name": "important",
            "resource_type": "tag"
        }
    ],
    "resource": "tag",
    "total_count": 1
}
```




### Teams

Title: Teams - Users | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/users/teams/

Published Time: Thu, 15 Feb 2018 07:35:46 GMT

Markdown Content:
# Teams - Users | Kayako Developers

[![Image 1](https://developer.kayako.com/img/kayako-logo.png)](https://developer.kayako.com/)

*     
*   [Docs](https://developer.kayako.com/docs/single_sign_on/introduction/)
*   [API](https://developer.kayako.com/api/v1/reference/introduction/)
*   [SDK](https://developer.kayako.com/sdk/java/integration_guide/)
*   [Messenger![Image 2: beta](https://developer.kayako.com/img/new.png)](https://developer.kayako.com/messenger/home/)

*     
*   [Docs](https://developer.kayako.com/docs/single_sign_on/introduction/)
*   [API](https://developer.kayako.com/api/v1/reference/introduction/)
*   [SDK](https://developer.kayako.com/sdk/java/integration_guide/)
*   [Messenger![Image 3: beta](https://developer.kayako.com/img/new.png)](https://developer.kayako.com/messenger/home/)

Users

*   [Reference](https://developer.kayako.com/api/v1/reference/introduction/)
Core*   [Users](https://developer.kayako.com/api/v1/users/activities/)
*   [Cases](https://developer.kayako.com/api/v1/cases/activities/)
*   [Insights](https://developer.kayako.com/api/v1/insights/cases/)
*   [Search](https://developer.kayako.com/api/v1/search/search/)
*   [Automation](https://developer.kayako.com/api/v1/automation/endpoints/)
Channels*   [Twitter](https://developer.kayako.com/api/v1/twitter/accounts/)
*   [Facebook](https://developer.kayako.com/api/v1/facebook/accounts/)
*   [Mail](https://developer.kayako.com/api/v1/mail/mailboxes/)
*   [Event](https://developer.kayako.com/api/v1/event/events/)
*   [Help Center](https://developer.kayako.com/api/v1/help_center/articles/)
Others*   [General](https://developer.kayako.com/api/v1/general/autocomplete/)

*   [Activities](https://developer.kayako.com/api/v1/users/activities/)
*   [Cases](https://developer.kayako.com/api/v1/users/cases/)
*   [Fields](https://developer.kayako.com/api/v1/users/fields/)
*   [Identities](https://developer.kayako.com/api/v1/users/identities/)
*   [Me](https://developer.kayako.com/api/v1/users/me/)
*   [Notes](https://developer.kayako.com/api/v1/users/notes/)
*   [Organizations](https://developer.kayako.com/api/v1/users/organizations/)
*   [Profile](https://developer.kayako.com/api/v1/users/profile/)
*   [Roles](https://developer.kayako.com/api/v1/users/roles/)
*   [Tags](https://developer.kayako.com/api/v1/users/tags/)
*   [Teams](https://developer.kayako.com/api/v1/users/teams/)
    *   [Resource fields](https://developer.kayako.com/api/v1/users/teams/#resource-fields)
    *   [Retrieve all teams](https://developer.kayako.com/api/v1/users/teams/#Retrieve-all-teams)
    *   [Retrieve available teams](https://developer.kayako.com/api/v1/users/teams/#Retrieve-available-teams)
    *   [Retrieve a team](https://developer.kayako.com/api/v1/users/teams/#Retrieve-a-team)
    *   [Add a team](https://developer.kayako.com/api/v1/users/teams/#Add-a-team)
    *   [Bulk add teams](https://developer.kayako.com/api/v1/users/teams/#Bulk-add-teams)
    *   [Update a team](https://developer.kayako.com/api/v1/users/teams/#Update-a-team)
    *   [Delete a team](https://developer.kayako.com/api/v1/users/teams/#Delete-a-team)
    *   [Delete teams](https://developer.kayako.com/api/v1/users/teams/#Delete-teams)
    *   [Members](https://developer.kayako.com/api/v1/users/teams/#Members)
        *   [Retrieve all members](https://developer.kayako.com/api/v1/users/teams/#Members__Retrieve-all-members)
        *   [Add a member](https://developer.kayako.com/api/v1/users/teams/#Members__Add-a-member)
        *   [Delete a member](https://developer.kayako.com/api/v1/users/teams/#Members__Delete-a-member)
        *   [Delete members](https://developer.kayako.com/api/v1/users/teams/#Members__Delete-members)

*   [Users](https://developer.kayako.com/api/v1/users/users/)

1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   CORE
4.   USERS

# Teams

## Resource Fields

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| legacy_id | string |  |  |
| title | string |  |  |
| businesshour | [Business hours](https://developer.kayako.com/api/v1/general/business_hours/) |  |  |
| member_count | integer |  |  |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Metadata

Version 1.0
Last Updated July 04, 2016

## Actions

## Retrieve all teams

GET**/api/v1/teams.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)
Ordered by id (ascending)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| legacy_ids | string |  | The comma separated legacy ids |

### Response

```text
{
        "status": 200,
        "data": [
            {
    "id": 1,
    "legacy_id": null,

    "title": "Support",
    "businesshour": {
    "id": 1,

    "resource_type": "business_hour"

}
,
    "member_count": 4,
    "created_at": "2015-07-21T07:10:42+05:00",
    "updated_at": "2015-07-21T08:50:19+05:00",

    "resource_type": "team"

    ,"resource_url": "https://brewfictus.kayako.com/api/v1/teams/1"

}
        ],
        "resource": "team",
        "offset": 0,
        "limit": 10,
        "total_count": 1
    }
```

## Retrieve available teams

GET**/api/v1/teams/availability.json**

### Information

Allowed for Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)
Ordered by id (ascending)

### Response

```text
{
        "status": 200,
        "data": [
            {
    "id": 1,
    "legacy_id": null,

    "title": "Support",
    "businesshour": {
    "id": 1,

    "resource_type": "business_hour"

}
,
    "member_count": 4,
    "created_at": "2015-07-21T07:10:42+05:00",
    "updated_at": "2015-07-21T08:50:19+05:00",

    "resource_type": "team"

    ,"resource_url": "https://brewfictus.kayako.com/api/v1/teams/1"

}
        ],
        "resource": "team",
        "total_count": 1
    }
```

## Retrieve a team

GET**/api/v1/teams/:id.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Response

```text
{
        "status": 200,
        "data": {
    "id": 1,
    "legacy_id": null,

    "title": "Support",
    "businesshour": {
    "id": 1,

    "resource_type": "business_hour"

}
,
    "member_count": 4,
    "created_at": "2015-07-21T07:10:42+05:00",
    "updated_at": "2015-07-21T08:50:19+05:00",

    "resource_type": "team"

    ,"resource_url": "https://brewfictus.kayako.com/api/v1/teams/1"

},
        "resource": "team"
    }
```

## Add a team

POST**/api/v1/teams.json**

### Information

Allowed for Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| legacy_id | string |  |  |
| title | string |  |  |
| businesshour_id | integer |  |  |

### Response

```text
{
        "status": 201,
        "data": {
    "id": 1,
    "legacy_id": null,

    "title": "Support",
    "businesshour": {
    "id": 1,

    "resource_type": "business_hour"

}
,
    "member_count": 4,
    "created_at": "2015-07-21T07:10:42+05:00",
    "updated_at": "2015-07-21T08:50:19+05:00",

    "resource_type": "team"

    ,"resource_url": "https://brewfictus.kayako.com/api/v1/teams/1"

},
        "resource": "team"
    }
```

## Bulk add teams

POST**/api/v1/bulk/teams.json**

### Information

Allowed for Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

 You can insert a maximum of 200 teams at a time 

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| teams | array |  | Array of teams to be inserted |

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| partial_import | boolean |  | By default, even if a single record is invalid, the entire batch is dropped. However, if this parameter is set to `true`, all the records with no validation errors will be inserted while the invalid records will be returned back. |

### Request

```text
curl -X POST https://brewfictus.kayako.com/api/v1/bulk/teams \
    -d '{"teams":[{"title" : "Team1"},{"title" : "Team2", "legacy_id" : "legacy_101"}]}' \
    -H "Content-Type: application/json"
```

### Response

```text
{
        "status": 202,
        "data": {
    "id": 1,
    "status": "PENDING",
    "created_at": "2015-07-30T06:45:25+05:00",
    "updated_at": "2015-07-30T06:45:25+05:00",
    "resource_type": "bulk_job",
    "resource_url": "https://brewfictus.kayako.com/api/v1/jobs/1"
}
,
        "resource": "job"
    }
```

## Update a team

PUT**/api/v1/teams/:id.json**

### Information

Allowed for Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| title | string |  |  |
| businesshour_id | integer |  |  |

### Response

```text
{
        "status": 200,
        "data": {
    "id": 1,
    "legacy_id": null,

    "title": "Support",
    "businesshour": {
    "id": 1,

    "resource_type": "business_hour"

}
,
    "member_count": 4,
    "created_at": "2015-07-21T07:10:42+05:00",
    "updated_at": "2015-07-21T08:50:19+05:00",

    "resource_type": "team"

    ,"resource_url": "https://brewfictus.kayako.com/api/v1/teams/1"

},
        "resource": "team"
    }
```

## Delete a team

DELETE**/api/v1/teams/:id.json**

### Information

Allowed for Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Response

```text
{
    "status": 200
}
```

## Delete teams

DELETE**/api/v1/teams.json**

### Information

Allowed for Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Response

```text
{
    "status": 200,
    "total_count": 2
}
```

## Members

## Retrieve all members

GET**/api/v1/teams/:id/members.json**

### Information

Allowed for Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)
Ordered by id (descending)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| is_enabled | boolean |  | Filter enbled or disabled members |

### Response

```text
{
        "status": 200,
        "data": [

{
    "id": 1,

    "uuid": "11b60c25-c44c-47b8-9f48-56631cd7fa01",
    "full_name": "Simon Blackhouse",
    "legacy_id": null,
    "designation": "Community Manager",
    "is_enabled": true,
    "is_mfa_enabled": true,
    "role":

{
    "id": 2,

    "resource_type": "role"

},

    "avatar": "https://brewfictus.kayako.com/avatar/get/24ee2d81-ad95-5ae1-a07e-7ccedcdb70b8",
    "agent_case_access": "ALL",
    "organization_case_access": null,
    "organization": {
    "id": 1,

    "resource_type": "organization"

}
,
    "teams": [

    ],
    "emails": [
        {
    "id": 1,

    "resource_type": "identity_email"

}
    ],
    "phones": [

{
    "id": 1,

    "resource_type": "identity_phone"

}

    ],
    "twitter": [],
    "facebook": [],
    "external_identifiers": [],
    "addresses": [
        {
    "id": 1,

    "resource_type": "contact_address"

}

    ],
    "websites": [
        {
    "id": 1,

    "resource_type": "contact_website"

}
    ],
   "custom_fields": [
       {
           "field": {
    "id": 1,

    "resource_type": "user_field"

}
,
           "value": "Customer Success",
           "resource_type": "user_field_value"
       }
    ],
    "pinned_notes_count": 0,
    "locale": "en-us",
    "time_zone": null,
    "time_zone_offset": null,
    "greeting": null,
    "signature": null,
    "status_message": null,
    "last_seen_user_agent": null,
    "last_seen_ip": null,
    "last_seen_at": null,
    "last_active_at": null,
    "realtime_channel": "presence-0c1c9535b26b749f815a22cb459a4a8084be77b6ac9515751ef5a743b190bef3@v1_users_6",
    "presence_channel": "user_presence-281f395f6f51d031a6d3db3489906c98285191ebac41bb744f9323f61af63433@5c98cdaa58dd91ff1119a476e8b3e305d2906d3b",
    "password_updated_at": "2016-03-15T10:38:01+05:00",
    "avatar_updated_at": null,
    "last_logged_in_at": null,
    "last_activity_at": null,
    "created_at": "2016-03-15T10:38:01+05:00",
    "updated_at": "2016-03-15T10:38:01+05:00",

    "resource_type": "user"

    ,"resource_url": "https://brewfictus.kayako.com/api/v1/users/1"

}

        ],
        "resource": "user",
        "offset": 0,
        "limit": 10,
        "total_count": 1
    }
```

## Add a member

POST**/api/v1/teams/:id/members.json**

### Information

Allowed for Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| agent_ids | integer |  |  |

### Response

```text
{
        "status": 201,
        "data": 

{
    "id": 1,

    "uuid": "11b60c25-c44c-47b8-9f48-56631cd7fa01",
    "full_name": "Simon Blackhouse",
    "legacy_id": null,
    "designation": "Community Manager",
    "is_enabled": true,
    "is_mfa_enabled": true,
    "role":

{
    "id": 2,

    "resource_type": "role"

},

    "avatar": "https://brewfictus.kayako.com/avatar/get/24ee2d81-ad95-5ae1-a07e-7ccedcdb70b8",
    "agent_case_access": "ALL",
    "organization_case_access": null,
    "organization": {
    "id": 1,

    "resource_type": "organization"

}
,
    "teams": [

    ],
    "emails": [
        {
    "id": 1,

    "resource_type": "identity_email"

}
    ],
    "phones": [

{
    "id": 1,

    "resource_type": "identity_phone"

}

    ],
    "twitter": [],
    "facebook": [],
    "external_identifiers": [],
    "addresses": [
        {
    "id": 1,

    "resource_type": "contact_address"

}

    ],
    "websites": [
        {
    "id": 1,

    "resource_type": "contact_website"

}
    ],
   "custom_fields": [
       {
           "field": {
    "id": 1,

    "resource_type": "user_field"

}
,
           "value": "Customer Success",
           "resource_type": "user_field_value"
       }
    ],
    "pinned_notes_count": 0,
    "locale": "en-us",
    "time_zone": null,
    "time_zone_offset": null,
    "greeting": null,
    "signature": null,
    "status_message": null,
    "last_seen_user_agent": null,
    "last_seen_ip": null,
    "last_seen_at": null,
    "last_active_at": null,
    "realtime_channel": "presence-0c1c9535b26b749f815a22cb459a4a8084be77b6ac9515751ef5a743b190bef3@v1_users_6",
    "presence_channel": "user_presence-281f395f6f51d031a6d3db3489906c98285191ebac41bb744f9323f61af63433@5c98cdaa58dd91ff1119a476e8b3e305d2906d3b",
    "password_updated_at": "2016-03-15T10:38:01+05:00",
    "avatar_updated_at": null,
    "last_logged_in_at": null,
    "last_activity_at": null,
    "created_at": "2016-03-15T10:38:01+05:00",
    "updated_at": "2016-03-15T10:38:01+05:00",

    "resource_type": "user"

    ,"resource_url": "https://brewfictus.kayako.com/api/v1/users/1"

}
,
        "resource": "user"
    }
```

## Delete a member

DELETE**/api/v1/teams/:id/members.json**

### Information

Allowed for Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| agent_id | integer |  |  |

### Response

```text
{
    "status": 200
}
```

## Delete members

DELETE**/api/v1/teams/:id/members.json**

### Information

Allowed for Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| agent_ids | string |  | The comma separated agent ids |

### Response

```text
{
    "status": 200,
    "total_count": 2
}
```

 Copyright © 2018 [Kayako](http://www.kayako.com/). All rights reserved • [Privacy Policy](http://www.kayako.com/about/privacy)

[](https://www.facebook.com/kayako/)[](https://twitter.com/kayako)




### Users

Title: Users - Users | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/users/users/

Markdown Content:
# Users - Users | Kayako Developers

[![Image 1](https://developer.kayako.com/img/kayako-logo.png)](https://developer.kayako.com/)

*     
*   [Docs](https://developer.kayako.com/docs/single_sign_on/introduction/)
*   [API](https://developer.kayako.com/api/v1/reference/introduction/)
*   [SDK](https://developer.kayako.com/sdk/java/integration_guide/)
*   [Messenger![Image 2: beta](https://developer.kayako.com/img/new.png)](https://developer.kayako.com/messenger/home/)

*     
*   [Docs](https://developer.kayako.com/docs/single_sign_on/introduction/)
*   [API](https://developer.kayako.com/api/v1/reference/introduction/)
*   [SDK](https://developer.kayako.com/sdk/java/integration_guide/)
*   [Messenger![Image 3: beta](https://developer.kayako.com/img/new.png)](https://developer.kayako.com/messenger/home/)

Users

*   [Reference](https://developer.kayako.com/api/v1/reference/introduction/)
Core*   [Users](https://developer.kayako.com/api/v1/users/activities/)
*   [Cases](https://developer.kayako.com/api/v1/cases/activities/)
*   [Insights](https://developer.kayako.com/api/v1/insights/cases/)
*   [Search](https://developer.kayako.com/api/v1/search/search/)
*   [Automation](https://developer.kayako.com/api/v1/automation/endpoints/)
Channels*   [Twitter](https://developer.kayako.com/api/v1/twitter/accounts/)
*   [Facebook](https://developer.kayako.com/api/v1/facebook/accounts/)
*   [Mail](https://developer.kayako.com/api/v1/mail/mailboxes/)
*   [Event](https://developer.kayako.com/api/v1/event/events/)
*   [Help Center](https://developer.kayako.com/api/v1/help_center/articles/)
Others*   [General](https://developer.kayako.com/api/v1/general/autocomplete/)

*   [Activities](https://developer.kayako.com/api/v1/users/activities/)
*   [Cases](https://developer.kayako.com/api/v1/users/cases/)
*   [Fields](https://developer.kayako.com/api/v1/users/fields/)
*   [Identities](https://developer.kayako.com/api/v1/users/identities/)
*   [Me](https://developer.kayako.com/api/v1/users/me/)
*   [Notes](https://developer.kayako.com/api/v1/users/notes/)
*   [Organizations](https://developer.kayako.com/api/v1/users/organizations/)
*   [Profile](https://developer.kayako.com/api/v1/users/profile/)
*   [Roles](https://developer.kayako.com/api/v1/users/roles/)
*   [Tags](https://developer.kayako.com/api/v1/users/tags/)
*   [Teams](https://developer.kayako.com/api/v1/users/teams/)
*   [Users](https://developer.kayako.com/api/v1/users/users/)
    *   [Resource fields](https://developer.kayako.com/api/v1/users/users/#resource-fields)
    *   [Propositions](https://developer.kayako.com/api/v1/users/users/#Propositions)
        *   [Retrieve all definitions](https://developer.kayako.com/api/v1/users/users/#Definitions__Retrieve-all-definitions)
        *   [Autocomplete](https://developer.kayako.com/api/v1/users/users/#Definitions__Autocomplete)
        *   [Retrieve smart lists of users](https://developer.kayako.com/api/v1/users/users/#Definitions__Retrieve-smart-lists-of-users)

    *   [Retrieve all users](https://developer.kayako.com/api/v1/users/users/#Retrieve-all-users)
    *   [Retrieve a user](https://developer.kayako.com/api/v1/users/users/#Retrieve-a-user)
    *   [Add a user](https://developer.kayako.com/api/v1/users/users/#Add-a-user)
    *   [Bulk add users](https://developer.kayako.com/api/v1/users/users/#Bulk-add-users)
    *   [Send invitation with details](https://developer.kayako.com/api/v1/users/users/#Send-invitation-with-details)
    *   [Update a user](https://developer.kayako.com/api/v1/users/users/#Update-a-user)
    *   [Update users](https://developer.kayako.com/api/v1/users/users/#Update-users)
    *   [Update a password](https://developer.kayako.com/api/v1/users/users/#Update-a-password)
    *   [Reset password](https://developer.kayako.com/api/v1/users/users/#Reset-password)
    *   [Delete a user](https://developer.kayako.com/api/v1/users/users/#Delete-a-user)
    *   [Delete users](https://developer.kayako.com/api/v1/users/users/#Delete-users)
    *   [Posts](https://developer.kayako.com/api/v1/users/users/#Posts)
        *   [Retrieve user posts](https://developer.kayako.com/api/v1/users/users/#Posts__Retrieve-user-posts)
        *   [Retrieve a post](https://developer.kayako.com/api/v1/users/users/#Posts__Retrieve-a-post)

1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   CORE
4.   USERS

# Users

## Resource Fields

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| uuid | string |  |  |
| full_name | string |  |  |
| legacy_id | string |  |  |
| designation | string |  |  |
| is_enabled | boolean |  |  |
| is_mfa_enabled | boolean |  | Whether the user has [MFA (Multi-factor authentication)](https://support.kayako.com/article/1198-securing-your-user-account-with-two-factor-authentication-2fa) enabled or not. |
| role | [Role](https://developer.kayako.com/api/v1/users/roles/) |  |  |
| avatar | string |  |  |
| agent_case_access | string |  | `SELF`, `TEAMS`, `INHERIT-FROM-ROLE`, `ALL` Only applicable for the role type `ADMIN`, `AGENT`, `COLLABORATOR` **Default:**`ALL` |
| organization_case_access | string |  | `REQUESTED`, `ORGANIZATION` Only applicable for the role type `CUSTOMER` **Default:**`REQUESTED` |
| organization | [Organization](https://developer.kayako.com/api/v1/users/organizations/) |  |  |
| teams | [Teams](https://developer.kayako.com/api/v1/users/teams/) |  |  |
| emails | [Emails](https://developer.kayako.com/api/v1/users/identities/#Emails) |  |  |
| phones | [Phones](https://developer.kayako.com/api/v1/users/identities/#Phones) |  |  |
| twitter | [Twitter](https://developer.kayako.com/api/v1/users/identities/#Twitter) |  |  |
| facebook | [Facebook](https://developer.kayako.com/api/v1/users/identities/#Facebook) |  |  |
| external_identifiers | [External Identifiers](https://developer.kayako.com/api/v1/users/identities/#External-identifiers) |  |  |
| custom_fields | [Custom Fields](https://developer.kayako.com/api/v1/users/users/#) |  |  |
| pinned_notes_count | integer |  |  |
| locale | [Locale](https://developer.kayako.com/api/v1/general/locales/) |  |  |
| time_zone | string |  |  |
| time_zone_offset | string |  | The time zone offset of the person. Useful for calculating the timezone differences. |
| greeting | string |  |  |
| signature | string |  |  |
| status_message | string |  |  |
| last_seen_user_agent | string |  |  |
| last_seen_ip | string |  |  |
| last_seen_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| last_active_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format. The timestamp when user's direct or indirect property updated like note added or tag created for user. |
| realtime_channel | string |  | Subscribe to this channel for realtime updates |
| presence_channel | string |  | Subscribe to see "who's online" |
| password_updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| avatar_updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| last_logged_in_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| last_activity_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Metadata

Version 1.0
Last Updated July 04, 2016

## Actions

## Propositions

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| label | string |  |  |
| field | string |  | Field name on which the rules will be applied |
| type | string |  | `NUMERIC`, `STRING`, `BOOLEAN`, `COLLECTION`, `DATE_ABSOLUTE`, `DATE_RELATIVE` |
| sub_type | string |  | Depends on type: **NUMERIC:**`FLOAT`, `INTEGER` **DATE_RELATIVE:**`PAST`, `PAST_OR_PRESENT`, `PRESENT`, `PAST_OR_FUTURE`, `FUTURE` |
| group | string |  | `DATE` for type `DATE_ABSOLUTE`, `DATE_RELATIVE` |
| input_type | string |  | `INTEGER`, `FLOAT`, `STRING`, `BOOLEAN`, `OPTIONS`, `MULTIPLE`, `TAGS`, `DATE_ABSOLUTE`, `DATE_RELATIVE`, `AUTOCOMPLETE` |
| operators | array |  | Depends on input_type: **INTEGER, FLOAT:**`comparison_equalto`, `comparison_greaterthan`, `comparison_lessthan` **STRING:**`string_contains_insensitive`, `comparison_equalto`, `comparison_not_equalto` **BOOLEAN:**`comparison_equalto`, `comparison_not_equalto` **OPTIONS:**`comparison_equalto`, `comparison_not_equalto` **TAGS:**`collection_contains_insensitive`, `collection_contains_any_insensitive`, `collection_does_not_contain_insensitive` **DATE_ABSOLUTE:**`date_is`, `date_is_not` **DATE_RELATIVE:**`date_after_or_on`, `date_before_or_on` **AUTOCOMPLETE:**`comparison_equalto`, `comparison_not_equalto` |
| values | mixed |  | **Input type:**`OPTIONS` `{"1":"Kayako", "2":"Subscription"}` **Input type:**`INTEGER`, `FLOAT`, `BOOLEAN`, `TAGS`, `STRING`, `DATE_ABSOLUTE` or `TIME` value `n/a` **Input type:**`MULTIPLE` `{"1":"Kayako", "2":"Subscription"}` **Input type:**`RELATIVE` `{"today":"today", "currentweek":"currentweek", "currentmonth":"currentmonth"}` **Input type:**`AUTOCOMPLETE` [AUTOCOMPLETE](https://developer.kayako.com/api/v1/users/users/users/#Definitions__Autocomplete) |

## Retrieve all definitions

GET**/api/v1/users/definitions.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners

### Response

```text
{
    "status": 200,
    "data": [
        {
            "label": "Name",
            "field": "users.fullname",
            "type": "STRING",
            "sub_type": "",
            "group": "",
            "input_type": "STRING",
            "operators": [
                "string_contains_insensitive",
                "comparison_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Organization",
            "field": "users.organizationid",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "",
            "input_type": "AUTOCOMPLETE",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Role",
            "field": "roles.type",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "1": "Owner",
                "2": "Admin",
                "3": "Agent",
                "4": "Collaborator",
                "5": "Customer"
            },
            "resource_type": "definition"
        },
        {
            "label": "Tags",
            "field": "tags.name",
            "type": "COLLECTION",
            "sub_type": "",
            "group": "",
            "input_type": "TAGS",
            "operators": [
                "collection_contains_insensitive",
                "collection_contains_any_insensitive",
                "collection_does_not_contain_insensitive"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Email",
            "field": "identityemails.address",
            "type": "STRING",
            "sub_type": "",
            "group": "",
            "input_type": "STRING",
            "operators": [
                "string_contains_insensitive",
                "comparison_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Twitter",
            "field": "identitytwitter.screenname",
            "type": "STRING",
            "sub_type": "",
            "group": "",
            "input_type": "STRING",
            "operators": [
                "string_contains_insensitive",
                "comparison_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Facebook",
            "field": "identityfacebook.name",
            "type": "STRING",
            "sub_type": "",
            "group": "",
            "input_type": "STRING",
            "operators": [
                "string_contains_insensitive",
                "comparison_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Phone",
            "field": "identityphones.number",
            "type": "STRING",
            "sub_type": "",
            "group": "",
            "input_type": "STRING",
            "operators": [
                "string_contains_insensitive",
                "comparison_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Last seen",
            "field": "users.lastseenat_relative_past",
            "type": "DATE_RELATIVE",
            "sub_type": "PAST_OR_PRESENT",
            "group": "DATE",
            "input_type": "DATE_RELATIVE",
            "operators": [
                "date_before_or_on"
            ],
            "values": {
                "today": "today",
                "currentweek": "currentweek",
                "currentmonth": "currentmonth",
                "currentyear": "currentyear",
                "tomorrow": "tomorrow",
                "yesterday": "yesterday",
                "lastweek": "lastweek",
                "lastmonth": "lastmonth",
                "lastyear": "lastyear",
                "last7days": "last7days",
                "last30days": "last30days",
                "last90days": "last90days",
                "last180days": "last180days",
                "last365days": "last365days"
            },
            "resource_type": "definition"
        },
        {
            "label": "Last seen",
            "field": "users.lastseenat_absolute",
            "type": "DATE_ABSOLUTE",
            "sub_type": "",
            "group": "DATE",
            "input_type": "DATE_ABSOLUTE",
            "operators": [
                "date_is",
                "date_is_not"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Last logged in",
            "field": "loginlogs.loginat_relative_past",
            "type": "DATE_RELATIVE",
            "sub_type": "PAST_OR_PRESENT",
            "group": "DATE",
            "input_type": "DATE_RELATIVE",
            "operators": [
                "date_before_or_on"
            ],
            "values": {
                "today": "today",
                "currentweek": "currentweek",
                "currentmonth": "currentmonth",
                "currentyear": "currentyear",
                "tomorrow": "tomorrow",
                "yesterday": "yesterday",
                "lastweek": "lastweek",
                "lastmonth": "lastmonth",
                "lastyear": "lastyear",
                "last7days": "last7days",
                "last30days": "last30days",
                "last90days": "last90days",
                "last180days": "last180days",
                "last365days": "last365days"
            },
            "resource_type": "definition"
        },
        {
            "label": "Last logged in",
            "field": "loginlogs.loginat_absolute",
            "type": "DATE_ABSOLUTE",
            "sub_type": "",
            "group": "DATE",
            "input_type": "DATE_ABSOLUTE",
            "operators": [
                "date_is",
                "date_is_not"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Created at",
            "field": "users.createdat_relative_past",
            "type": "DATE_RELATIVE",
            "sub_type": "PAST_OR_PRESENT",
            "group": "DATE",
            "input_type": "DATE_RELATIVE",
            "operators": [
                "date_before_or_on"
            ],
            "values": {
                "today": "today",
                "currentweek": "currentweek",
                "currentmonth": "currentmonth",
                "currentyear": "currentyear",
                "tomorrow": "tomorrow",
                "yesterday": "yesterday",
                "lastweek": "lastweek",
                "lastmonth": "lastmonth",
                "lastyear": "lastyear",
                "last7days": "last7days",
                "last30days": "last30days",
                "last90days": "last90days",
                "last180days": "last180days",
                "last365days": "last365days"
            },
            "resource_type": "definition"
        },
        {
            "label": "Created at",
            "field": "users.createdat_absolute",
            "type": "DATE_ABSOLUTE",
            "sub_type": "",
            "group": "DATE",
            "input_type": "DATE_ABSOLUTE",
            "operators": [
                "date_is",
                "date_is_not"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Updated at",
            "field": "users.updatedat_relative_past",
            "type": "DATE_RELATIVE",
            "sub_type": "PAST_OR_PRESENT",
            "group": "DATE",
            "input_type": "DATE_RELATIVE",
            "operators": [
                "date_before_or_on"
            ],
            "values": {
                "today": "today",
                "currentweek": "currentweek",
                "currentmonth": "currentmonth",
                "currentyear": "currentyear",
                "tomorrow": "tomorrow",
                "yesterday": "yesterday",
                "lastweek": "lastweek",
                "lastmonth": "lastmonth",
                "lastyear": "lastyear",
                "last7days": "last7days",
                "last30days": "last30days",
                "last90days": "last90days",
                "last180days": "last180days",
                "last365days": "last365days"
            },
            "resource_type": "definition"
        },
        {
            "label": "Updated at",
            "field": "users.updatedat_absolute",
            "type": "DATE_ABSOLUTE",
            "sub_type": "",
            "group": "DATE",
            "input_type": "DATE_ABSOLUTE",
            "operators": [
                "date_is",
                "date_is_not"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "OS",
            "field": "userbrowsers.os",
            "type": "COLLECTION",
            "sub_type": "",
            "group": "",
            "input_type": "MULTIPLE",
            "operators": [
                "collection_contains_insensitive",
                "collection_contains_any_insensitive",
                "collection_does_not_contain_insensitive"
            ],
            "values": {
                "OS X": "OS X"
            },
            "resource_type": "definition"
        },
        {
            "label": "Browser",
            "field": "userbrowsers.name",
            "type": "STRING",
            "sub_type": "",
            "group": "",
            "input_type": "STRING",
            "operators": [
                "string_contains_insensitive",
                "comparison_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Browser version",
            "field": "userbrowsers.version",
            "type": "STRING",
            "sub_type": "",
            "group": "",
            "input_type": "STRING",
            "operators": [
                "string_contains_insensitive",
                "comparison_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "City",
            "field": "locations.city",
            "type": "STRING",
            "sub_type": "",
            "group": "",
            "input_type": "STRING",
            "operators": [
                "string_contains_insensitive",
                "comparison_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Country",
            "field": "locations.country",
            "type": "STRING",
            "sub_type": "",
            "group": "",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "AF": "Afghanistan",
                "AX": "Åland Islands",
                "AL": "Albania",
                "GB": "United Kingdom",
                "US": "United States"
            },
            "resource_type": "definition"
        },
        {
            "label": "Region",
            "field": "locations.region",
            "type": "STRING",
            "sub_type": "",
            "group": "",
            "input_type": "STRING",
            "operators": [
                "string_contains_insensitive",
                "comparison_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Timezone",
            "field": "users.timezone",
            "type": "STRING",
            "sub_type": "",
            "group": "",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "Africa/Abidjan": "Africa/Abidjan",
                "Africa/Accra": "Africa/Accra",
                "UTC": "UTC"
            },
            "resource_type": "definition"
        },
        {
            "label": "Language",
            "field": "users.languageid",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "1": "de"
            },
            "resource_type": "definition"
        },
        {
            "label": "User enabled",
            "field": "users.isenabled",
            "type": "BOOLEAN",
            "sub_type": "",
            "group": "",
            "input_type": "BOOLEAN",
            "operators": [
                "comparison_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "2FA",
            "field": "users.otptoken",
            "type": "BOOLEAN",
            "sub_type": "",
            "group": "",
            "input_type": "BOOLEAN",
            "operators": [
                "comparison_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "VIP Customer",
            "field": "userfields.vip_customer",
            "type": "COLLECTION",
            "sub_type": "",
            "group": "",
            "input_type": "MULTIPLE",
            "operators": [
                "collection_contains_insensitive",
                "collection_contains_any_insensitive",
                "collection_does_not_contain_insensitive"
            ],
            "values": {
                "1": "VIP Customer"
            },
            "resource_type": "definition"
        },
        {
            "label": "Address",
            "field": "userfields.address",
            "type": "STRING",
            "sub_type": "",
            "group": "",
            "input_type": "STRING",
            "operators": [
                "string_contains_insensitive",
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Product",
            "field": "userfields.product",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "2": "Kayako",
                "3": "OnDemand",
                "4": "Subscription",
                "5": "Download"
            },
            "resource_type": "definition"
        }
    ],
    "resource": "definition",
    "total_count": 24
}
```

## Autocomplete

### Autocomplete

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| users.organizationid | [Organization](https://developer.kayako.com/api/v1/general/autocomplete/#Organizations__Lookup-organizations) |  |  |

## Retrieve smart lists of users

POST**/api/v1/users/filter.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| predicates | string |  | **Examples:** {"collection_operator":"OR","collections":[{"proposition_operator":"AND","propositions":[{"field":"users.fullname","operator":"string_contains_insensitive","value":"dave"},{"field":"users.organizationid","operator":"comparison_equalto","value":"1"}]},{"proposition_operator":"OR","propositions":[{"field":"userbrowsers.os","operator":"collection_contains_insensitive","value":"OS X"},{"field":"userbrowsers.os","operator":"collection_contains_insensitive","value":"Windows"}]}]} |

### Response

```text
{
    "status": 200,
    "data": [
        {
            "id": 2,
            "uuid": "11b60c25-c44c-47b8-9f48-56631cd7fa01",
            "full_name": "Simon Blackhouse",
            "legacy_id": null,
            "designation": "Community Manager",
            "is_enabled": true,
            "is_mfa_enabled": true,
            "role": {
                "id": 4,
                "resource_type": "role"
            },
            "avatar": "https://brewfictus.kayako.com/avatar/get/24ee2d81-ad95-5ae1-a07e-7ccedcdb70b8",
            "agent_case_access": "ALL",
            "organization_case_access": null,
            "organization": {
                "id": 1,
                "resource_type": "organization"
            },
            "teams": [],
            "emails": [
                {
                    "id": 1,
                    "resource_type": "identity_email"
                }
            ],
            "phones": [
                {
                    "id": 2,
                    "resource_type": "identity_phone"
                }
            ],
            "twitter": [],
            "facebook": [],
            "external_identifiers": [],
            "addresses": [
                {
                    "id": 1,
                    "resource_type": "contact_address"
                }
            ],
            "websites": [
                {
                    "id": 1,
                    "resource_type": "contact_website"
                }
            ],
            "custom_fields": [
                {
                    "field": {
                        "id": 1,
                        "resource_type": "user_field"
                    },
                    "value": "Customer Success",
                    "resource_type": "user_field_value"
                }
            ],
            "pinned_notes_count": 0,
            "locale": "en-us",
            "time_zone": null,
            "time_zone_offset": null,
            "greeting": null,
            "signature": null,
            "status_message": null,
            "last_seen_user_agent": null,
            "last_seen_ip": null,
            "last_seen_at": null,
            "last_active_at": null,
            "realtime_channel": "presence-0c1c9535b26b749f815a22cb459a4a8084be77b6ac9515751ef5a743b190bef3@v1_users_6",
            "presence_channel": "user_presence-281f395f6f51d031a6d3db3489906c98285191ebac41bb744f9323f61af63433@5c98cdaa58dd91ff1119a476e8b3e305d2906d3b",
            "password_updated_at": "2016-03-15T10:38:01+05:00",
            "avatar_updated_at": null,
            "last_logged_in_at": null,
            "last_activity_at": null,
            "created_at": "2016-03-15T10:38:01+05:00",
            "updated_at": "2016-03-15T10:38:01+05:00",
            "resource_type": "user",
            "resource_url": "https://brewfictus.kayako.com/api/v1/users/2"
        }
    ],
    "resource": "user",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Retrieve all users

GET**/api/v1/users.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)
Ordered by id (descending)

### Role permissions

| User role type | can view |
| --- | --- |
| Agent | Customers, Collaborators, Agents & Admins |
| Admin | Customers, Collaborators, Agents & Admins |

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| role | string |  | `CUSTOMER`, `COLLABORATOR`, `AGENT`, `ADMIN` |

**OR**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | For retrieving users by ids, pass comma separated ids |

**OR**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| legacy_ids | string |  | The comma separated legacy ids |

### Response

```text
{
    "status": 200,
    "data": [
        {
            "id": 2,
            "uuid": "11b60c25-c44c-47b8-9f48-56631cd7fa01",
            "full_name": "Simon Blackhouse",
            "legacy_id": null,
            "designation": "Community Manager",
            "is_enabled": true,
            "is_mfa_enabled": true,
            "role": {
                "id": 4,
                "resource_type": "role"
            },
            "avatar": "https://brewfictus.kayako.com/avatar/get/24ee2d81-ad95-5ae1-a07e-7ccedcdb70b8",
            "agent_case_access": "ALL",
            "organization_case_access": null,
            "organization": {
                "id": 1,
                "resource_type": "organization"
            },
            "teams": [],
            "emails": [
                {
                    "id": 1,
                    "resource_type": "identity_email"
                }
            ],
            "phones": [
                {
                    "id": 2,
                    "resource_type": "identity_phone"
                }
            ],
            "twitter": [],
            "facebook": [],
            "external_identifiers": [],
            "addresses": [
                {
                    "id": 1,
                    "resource_type": "contact_address"
                }
            ],
            "websites": [
                {
                    "id": 1,
                    "resource_type": "contact_website"
                }
            ],
            "custom_fields": [
                {
                    "field": {
                        "id": 1,
                        "resource_type": "user_field"
                    },
                    "value": "Customer Success",
                    "resource_type": "user_field_value"
                }
            ],
            "pinned_notes_count": 0,
            "locale": "en-us",
            "time_zone": null,
            "time_zone_offset": null,
            "greeting": null,
            "signature": null,
            "status_message": null,
            "last_seen_user_agent": null,
            "last_seen_ip": null,
            "last_seen_at": null,
            "last_active_at": null,
            "realtime_channel": "presence-0c1c9535b26b749f815a22cb459a4a8084be77b6ac9515751ef5a743b190bef3@v1_users_6",
            "presence_channel": "user_presence-281f395f6f51d031a6d3db3489906c98285191ebac41bb744f9323f61af63433@5c98cdaa58dd91ff1119a476e8b3e305d2906d3b",
            "password_updated_at": "2016-03-15T10:38:01+05:00",
            "avatar_updated_at": null,
            "last_logged_in_at": null,
            "last_activity_at": null,
            "created_at": "2016-03-15T10:38:01+05:00",
            "updated_at": "2016-03-15T10:38:01+05:00",
            "resource_type": "user",
            "resource_url": "https://brewfictus.kayako.com/api/v1/users/2"
        }
    ],
    "resource": "user",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Retrieve a user

GET**/api/v1/users/:id.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Role permissions

| User role type | can view |
| --- | --- |
| Collaborator | Customers |
| Agent | Customers, Collaborators & Agents |
| Admin | Customers, Collaborators, Agents & Admins |

### Response

```text
{
    "status": 200,
    "data": {
        "id": 2,
        "uuid": "11b60c25-c44c-47b8-9f48-56631cd7fa01",
        "full_name": "Simon Blackhouse",
        "legacy_id": null,
        "designation": "Community Manager",
        "is_enabled": true,
        "is_mfa_enabled": true,
        "role": {
            "id": 4,
            "resource_type": "role"
        },
        "avatar": "https://brewfictus.kayako.com/avatar/get/24ee2d81-ad95-5ae1-a07e-7ccedcdb70b8",
        "agent_case_access": "ALL",
        "organization_case_access": null,
        "organization": {
            "id": 1,
            "resource_type": "organization"
        },
        "teams": [],
        "emails": [
            {
                "id": 1,
                "resource_type": "identity_email"
            }
        ],
        "phones": [
            {
                "id": 2,
                "resource_type": "identity_phone"
            }
        ],
        "twitter": [],
        "facebook": [],
        "external_identifiers": [],
        "addresses": [
            {
                "id": 1,
                "resource_type": "contact_address"
            }
        ],
        "websites": [
            {
                "id": 1,
                "resource_type": "contact_website"
            }
        ],
        "custom_fields": [
            {
                "field": {
                    "id": 1,
                    "resource_type": "user_field"
                },
                "value": "Customer Success",
                "resource_type": "user_field_value"
            }
        ],
        "pinned_notes_count": 0,
        "locale": "en-us",
        "time_zone": null,
        "time_zone_offset": null,
        "greeting": null,
        "signature": null,
        "status_message": null,
        "last_seen_user_agent": null,
        "last_seen_ip": null,
        "last_seen_at": null,
        "last_active_at": null,
        "realtime_channel": "presence-0c1c9535b26b749f815a22cb459a4a8084be77b6ac9515751ef5a743b190bef3@v1_users_6",
        "presence_channel": "user_presence-281f395f6f51d031a6d3db3489906c98285191ebac41bb744f9323f61af63433@5c98cdaa58dd91ff1119a476e8b3e305d2906d3b",
        "password_updated_at": "2016-03-15T10:38:01+05:00",
        "avatar_updated_at": null,
        "last_logged_in_at": null,
        "last_activity_at": null,
        "created_at": "2016-03-15T10:38:01+05:00",
        "updated_at": "2016-03-15T10:38:01+05:00",
        "resource_type": "user",
        "resource_url": "https://brewfictus.kayako.com/api/v1/users/2"
    },
    "resource": "user"
}
```

## Add a user

POST**/api/v1/users.json**

### Information

Allowed for Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Role permissions

| User role type | can add |
| --- | --- |
| Agent | Customers |
| Admin | Customers, Collaborators, Agents & Admins |

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| role_id | integer |  | The id of the role the user wants to associate with |
| full_name | string |  |  |
| legacy_id | string |  |  |
| email | string |  | The Primary email of this user **Mandatory** for the role types `COLLABORATOR`, `AGENT`, `ADMIN` |
| password | string |  |  |
| designation | string |  |  |
| team_ids | string |  | The comma separated ids. **Mandatory** for the role type `COLLABORATOR`, `AGENT`, `ADMIN` |
| agent_case_access | string |  | `SELF`, `TEAMS`, `INHERIT-FROM-ROLE`, `ALL` Applicable for the role type `COLLABORATOR`, `AGENT`, `ADMIN` **Default:**`ALL` |
| organization_case_access | string |  | `REQUESTED`, `ORGANIZATION` Only applicable for the role type `CUSTOMER` **Default:**`REQUESTED` |
| locale_id | integer |  | [Locales](https://developer.kayako.com/api/v1/general/locales) |
| signature | string |  | Only collaborators, agents & admins can have signature |
| greeting | string |  | Only collaborators, agents & admins can have greeting |
| status_message | string |  | Only collaborators, agents & admins can have status message |
| time_zone | string |  |  |
| field_values | array |  | This operation will add field values with requested field keys. **Format:** field_values[field_key] = field_value field_values[field_key] = field_value **For Options:** CSV options are accepted for multi-select |
| avatar | multipart/form-data |  |  |

### Response

```text
{
    "status": 201,
    "data": {
        "id": 2,
        "uuid": "11b60c25-c44c-47b8-9f48-56631cd7fa01",
        "full_name": "Simon Blackhouse",
        "legacy_id": null,
        "designation": "Community Manager",
        "is_enabled": true,
        "is_mfa_enabled": true,
        "role": {
            "id": 4,
            "resource_type": "role"
        },
        "avatar": "https://brewfictus.kayako.com/avatar/get/24ee2d81-ad95-5ae1-a07e-7ccedcdb70b8",
        "agent_case_access": "ALL",
        "organization_case_access": null,
        "organization": {
            "id": 1,
            "resource_type": "organization"
        },
        "teams": [],
        "emails": [
            {
                "id": 1,
                "resource_type": "identity_email"
            }
        ],
        "phones": [
            {
                "id": 2,
                "resource_type": "identity_phone"
            }
        ],
        "twitter": [],
        "facebook": [],
        "external_identifiers": [],
        "addresses": [
            {
                "id": 1,
                "resource_type": "contact_address"
            }
        ],
        "websites": [
            {
                "id": 1,
                "resource_type": "contact_website"
            }
        ],
        "custom_fields": [
            {
                "field": {
                    "id": 1,
                    "resource_type": "user_field"
                },
                "value": "Customer Success",
                "resource_type": "user_field_value"
            }
        ],
        "pinned_notes_count": 0,
        "locale": "en-us",
        "time_zone": null,
        "time_zone_offset": null,
        "greeting": null,
        "signature": null,
        "status_message": null,
        "last_seen_user_agent": null,
        "last_seen_ip": null,
        "last_seen_at": null,
        "last_active_at": null,
        "realtime_channel": "presence-0c1c9535b26b749f815a22cb459a4a8084be77b6ac9515751ef5a743b190bef3@v1_users_6",
        "presence_channel": "user_presence-281f395f6f51d031a6d3db3489906c98285191ebac41bb744f9323f61af63433@5c98cdaa58dd91ff1119a476e8b3e305d2906d3b",
        "password_updated_at": "2016-03-15T10:38:01+05:00",
        "avatar_updated_at": null,
        "last_logged_in_at": null,
        "last_activity_at": null,
        "created_at": "2016-03-15T10:38:01+05:00",
        "updated_at": "2016-03-15T10:38:01+05:00",
        "resource_type": "user",
        "resource_url": "https://brewfictus.kayako.com/api/v1/users/2"
    },
    "resource": "user"
}
```

## Bulk add users

POST**/api/v1/bulk/users.json**

### Information

Allowed for Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

 You can insert a maximum of 200 users at a time 

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| users | array |  | Array of users to be inserted |

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| partial_import | boolean |  | By default, even if a single record is invalid, the entire batch is dropped. However, if this parameter is set to `true`, all the records with no validation errors will be inserted while the invalid records will be returned back. |

### Request

```text
curl -X POST https://brewfictus.kayako.com/api/v1/bulk/users \
    -d '{"users":[{"full_name" : "John Doe", "role_id" : 4},{"full_name" : "Roger Doe", "legacy_id" : "legacy_101", "role_id" : 4}]}' \
    -H "Content-Type: application/json"
```

### Response

```text
{
    "status": 202,
    "data": {
        "id": 1,
        "status": "PENDING",
        "created_at": "2015-07-30T06:45:25+05:00",
        "updated_at": "2015-07-30T06:45:25+05:00",
        "resource_type": "bulk_job",
        "resource_url": "https://brewfictus.kayako.com/api/v1/jobs/1"
    },
    "resource": "job"
}
```

## Send invitation with details

POST**/api/v1/users/invite.json**

### Information

Allowed for Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| users | array |  | Users to be specified in JSON format. Supporting keys are `fullname`, `email`, `role_id`, `team_ids`, `twitter` **Note:** **_twitter_:** is optional key **_role\_id_:** allowed role types are `COLLABORATOR`, `AGENT`, `ADMIN` and `OWNER` **Example:** `[{"fullname": "Simon Blackhouse", "email": "simon.blackhouse@brewfictus.com", "role_id": 5, "team_ids": [1,2,3], "twitter": "blackhouse"}]` |

### Response

```text
{
    "status": 201
}
```

## Update a user

PUT**/api/v1/users/:id.json**

### Information

Allowed for Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Role permissions

| User role type | can update |
| --- | --- |
| Agent | Customers |
| Admin | Customers, Collaborators, Agents & Admins |

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| role_id | integer |  | The id of the role the user wants to associate with |
| full_name | string |  |  |
| designation | string |  |  |
| organization_id | integer |  | The id of the organization the user is associated with |
| team_ids | string |  | The comma separated ids. This will replace existing teams with new ones. Only applicable for the role type `ADMIN`, `AGENT`, `COLLABORATOR` |
| tags | string |  | The comma separated tags. This will replace existing tags with new ones |
| agent_case_access | string |  | `SELF`, `TEAMS`, `INHERIT-FROM-ROLE`, `ALL` Only applicable for the role type `ADMIN`, `AGENT`, `COLLABORATOR` |
| organization_case_access | string |  | `REQUESTED`, `ORGANIZATION` Only applicable for the role type `CUSTOMER` |
| locale_id | integer |  | [Locales](https://developer.kayako.com/api/v1/general/locales) |
| signature | string |  | Only collaborators, agents & admins can have signature |
| greeting | string |  | Only collaborators, agents & admins can have greeting |
| status_message | string |  | Only collaborators, agents & admins can have status message |
| time_zone | string |  |  |
| is_enabled | boolean |  |  |
| field_values | array |  | This operation will add or update existing field values with requested field keys. **Format:** field_values[field_key] = field_value field_values[field_key] = field_value **For Options:** CSV options are accepted for multi-select **WARNING:** All options must be passed. The options which are not passed will be removed. |
| avatar | multipart/form-data |  |  |

### Response

```text
{
    "status": 200,
    "data": {
        "id": 1,
        "uuid": "11b60c25-c44c-47b8-9f48-56631cd7fa01",
        "full_name": "Simon Blackhouse",
        "legacy_id": null,
        "designation": "Community Manager",
        "is_enabled": true,
        "is_mfa_enabled": true,
        "role": {
            "id": 2,
            "resource_type": "role"
        },
        "avatar": "https://brewfictus.kayako.com/avatar/get/24ee2d81-ad95-5ae1-a07e-7ccedcdb70b8",
        "agent_case_access": "ALL",
        "organization_case_access": null,
        "organization": {
            "id": 1,
            "resource_type": "organization"
        },
        "teams": [],
        "emails": [
            {
                "id": 1,
                "resource_type": "identity_email"
            }
        ],
        "phones": [
            {
                "id": 1,
                "resource_type": "identity_phone"
            }
        ],
        "twitter": [],
        "facebook": [],
        "external_identifiers": [],
        "addresses": [
            {
                "id": 1,
                "resource_type": "contact_address"
            }
        ],
        "websites": [
            {
                "id": 1,
                "resource_type": "contact_website"
            }
        ],
        "custom_fields": [
            {
                "field": {
                    "id": 1,
                    "resource_type": "user_field"
                },
                "value": "Customer Success",
                "resource_type": "user_field_value"
            }
        ],
        "pinned_notes_count": 0,
        "locale": "en-us",
        "time_zone": null,
        "time_zone_offset": null,
        "greeting": null,
        "signature": null,
        "status_message": null,
        "last_seen_user_agent": null,
        "last_seen_ip": null,
        "last_seen_at": null,
        "last_active_at": null,
        "realtime_channel": "presence-0c1c9535b26b749f815a22cb459a4a8084be77b6ac9515751ef5a743b190bef3@v1_users_6",
        "presence_channel": "user_presence-281f395f6f51d031a6d3db3489906c98285191ebac41bb744f9323f61af63433@5c98cdaa58dd91ff1119a476e8b3e305d2906d3b",
        "password_updated_at": "2016-03-15T10:38:01+05:00",
        "avatar_updated_at": null,
        "last_logged_in_at": null,
        "last_activity_at": null,
        "created_at": "2016-03-15T10:38:01+05:00",
        "updated_at": "2016-03-15T10:38:01+05:00",
        "resource_type": "user",
        "resource_url": "https://brewfictus.kayako.com/api/v1/users/1"
    },
    "resource": "user"
}
```

## Update users

PUT**/api/v1/users.json**

### Information

Allowed for Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Role permissions

| User role type | can update |
| --- | --- |
| Agent | Customers |
| Admin | Customers, Collaborators, Agents & Admins |

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| locale_id | integer |  | [Locales](https://developer.kayako.com/api/v1/general/locales) |
| tags | string |  | The comma separated tags. This will replace existing tags with new ones |
| time_zone | string |  |  |
| is_enabled | boolean |  |  |

### Response

```text
{
    "status": 200,
    "total_count": 2
}
```

## Update a password

PUT**/api/v1/users/:id/password.json**

### Information

Allowed for Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Role permissions

| User role type | can update |
| --- | --- |
| Agent | Customers |
| Admin | Customers, Collaborators, Agents & Admins |

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| new_password | string |  |  |

### Response

```text
{
    "status": 200
}
```

## Reset password

POST**/api/v1/password/reset.json**

### Information

Allowed for Public

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| email | string |  |  |

### Response

```text
{
    "status": 200
}
```

## Delete a user

DELETE**/api/v1/users/:id.json**

### Information

Allowed for Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Role permissions

| User role type | can delete |
| --- | --- |
| Agent | Customers |
| Admin | Customers, Collaborators, Agents & Admins |

### Response

```text
{
    "status": 200
}
```

## Delete users

DELETE**/api/v1/users.json**

### Information

Allowed for Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Role permissions

| User role type | can delete |
| --- | --- |
| Agent | Customers |
| Admin | Customers, Collaborators, Agents & Admins |

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Response

```text
{
    "status": 200,
    "total_count": 2
}
```

## Posts

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| uuid | string |  |  |
| sequence | integer |  |  |
| subject | string |  |  |
| contents | string |  |  |
| creator | [User](https://developer.kayako.com/api/v1/users/users/) |  |  |
| identity | [Identity](https://developer.kayako.com/api/v1/users/identities/) |  |  |
| source_channel | [Channel](https://developer.kayako.com/api/v1/users/users/#Channels) |  |  |
| attachments | [Attachments](https://developer.kayako.com/api/v1/users/users/#attachments) |  |  |
| download_all | string |  |  |
| original | Resource |  |  |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Attachments

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| size | integer |  |  |
| width | integer |  | Only if the attachment is image |
| height | integer |  | Only if the attachment is image |
| type | string |  | Mime-type of the file |
| content_id | string |  | Content ID used for inline attachment |
| alt | string |  |  |
| url | string |  | The URL to view the attachment |
| url_download | string |  | The URL to download the attachment |
| thumbnails | [Thumbnails](https://developer.kayako.com/api/v1/users/users/#thumbnails) |  |  |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Thumbnails

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| size | integer |  |  |
| width | integer |  |  |
| height | integer |  |  |
| type | string |  | Mime-type of the file |
| url | string |  | The URL to view the thumbnail |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve user posts

GET**/api/v1/users/:id/posts.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)
Ordered by id (descending)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| after_id | integer |  |  |
| before_id | integer |  |  |

At a time either after_id or before_id is allowed

### Response

```text
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "uuid": "0da0b7df-9528-4e76-af3e-b7419c61f400",
            "client_id": "93a236f0-edac-4b5a-8747-14140da7d4dc",
            "subject": "Customer is using Honey - Blend. So communicate accordingly",
            "contents": "Customer is using Honey - Blend. So communicate accordingly",
            "creator": {
                "id": 1,
                "resource_type": "user"
            },
            "identity": null,
            "source_channel": null,
            "attachments": [],
            "download_all": null,
            "destination_medium": "MESSENGER",
            "source": "MAIL",
            "metadata": {
                "user_agent": "Chrome",
                "page_url": ""
            },
            "original": {
                "id": 1,
                "resource_type": "note"
            },
            "post_status": "SENT",
            "post_status_reject_type": null,
            "post_status_reject_reason": null,
            "post_status_updated_at": "2016-11-08T18:44:27+00:00",
            "created_at": "2016-02-17T08:20:18+05:00",
            "updated_at": "2016-02-17T08:20:18+05:00",
            "resource_type": "post",
            "resource_url": "https://brewfictus.kayako.com/api/v1/users/posts/1"
        }
    ],
    "resource": "post",
    "limit": 10,
    "total_count": 1
}
```

## Retrieve a post

GET**/api/v1/users/posts/:id.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[users](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Response

```text
{
    "status": 200,
    "data": {
        "id": 1,
        "uuid": "0da0b7df-9528-4e76-af3e-b7419c61f400",
        "client_id": "93a236f0-edac-4b5a-8747-14140da7d4dc",
        "subject": "Customer is using Honey - Blend. So communicate accordingly",
        "contents": "Customer is using Honey - Blend. So communicate accordingly",
        "creator": {
            "id": 1,
            "resource_type": "user"
        },
        "identity": null,
        "source_channel": null,
        "attachments": [],
        "download_all": null,
        "destination_medium": "MESSENGER",
        "source": "MAIL",
        "metadata": {
            "user_agent": "Chrome",
            "page_url": ""
        },
        "original": {
            "id": 1,
            "resource_type": "note"
        },
        "post_status": "SENT",
        "post_status_reject_type": null,
        "post_status_reject_reason": null,
        "post_status_updated_at": "2016-11-08T18:44:27+00:00",
        "created_at": "2016-02-17T08:20:18+05:00",
        "updated_at": "2016-02-17T08:20:18+05:00",
        "resource_type": "post",
        "resource_url": "https://brewfictus.kayako.com/api/v1/users/posts/1"
    },
    "resource": "post"
}
```

 Copyright © 2018 [Kayako](http://www.kayako.com/). All rights reserved • [Privacy Policy](http://www.kayako.com/about/privacy)

[](https://www.facebook.com/kayako/)[](https://twitter.com/kayako)




---

## Core / Cases


### Activities

Title: Activities - Cases | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/cases/activities/

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   CORE
4.   CASES

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| activity | string |  | _An identifier for the activity_. create_case, update_case etc. Should contain a-Z and underscore. |
| actor | [Actor](https://developer.kayako.com/api/v1/cases/activities/#actor) |  | _Who did it_. The user/system that carried out this activity |
| verb | string |  | _What they did_. Create, Share, Join, Like, Notify etc. |
| summary | string |  |  |
| actions | [Actions](https://developer.kayako.com/api/v1/cases/activities/#actions) |  |  |
| object | [Object](https://developer.kayako.com/api/v1/cases/activities/#object) |  | _Activity performed on_. Conversation, Team, Event etc. |
| object_actor | [Actor](https://developer.kayako.com/api/v1/cases/activities/#actor) |  | If this activity's object is itself another activity, this property specifies the original activity's actor |
| location | [Location](https://developer.kayako.com/api/v1/cases/activities/#location) |  |  |
| place | [Place](https://developer.kayako.com/api/v1/cases/activities/#place) |  | Where the activity was carried out |
| target | [Target](https://developer.kayako.com/api/v1/cases/activities/#target) |  | Describes object targetted by activity |
| result | [Result](https://developer.kayako.com/api/v1/cases/activities/#result) |  | Describes the result of the activity |
| in_reply_to | [InReplyTo](https://developer.kayako.com/api/v1/cases/activities/#inreplyto) |  | Identifying an object which can be considered as a response to the base object |
| participant | [Participant](https://developer.kayako.com/api/v1/cases/activities/#participant) |  |  |
| portal | string |  |  |
| weight | float |  | Weight decides the priority/importance of this activity |
| ip_address | string |  |  |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Actions

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| action | string |  | `CREATED`, `UPDATED`, `DELETED` |
| field | string |  |  |
| old_value | string |  |  |
| new_value | string |  |  |
| old_object | Resource |  |  |
| new_object | Resource |  |  |

## Actor

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| titile | string |  |  |
| prefix | string |  |  |
| url | string |  |  |
| full_title | string |  |  |
| image | string |  |  |
| preposition | string |  |  |
| original | Resource |  |  |

## Object

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| titile | string |  |  |
| prefix | string |  |  |
| url | string |  |  |
| full_title | string |  |  |
| image | string |  |  |
| preposition | string |  |  |
| original | Resource |  |  |

## Place

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| titile | string |  |  |
| prefix | string |  |  |
| url | string |  |  |
| full_title | string |  |  |
| image | string |  |  |
| preposition | string |  |  |
| original | Resource |  |  |

## Target

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| titile | string |  |  |
| prefix | string |  |  |
| url | string |  |  |
| full_title | string |  |  |
| image | string |  |  |
| preposition | string |  |  |
| original | Resource |  |  |

## Result

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| titile | string |  |  |
| prefix | string |  |  |
| url | string |  |  |
| full_title | string |  |  |
| image | string |  |  |
| preposition | string |  |  |
| original | Resource |  |  |

## InReplyTo

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| titile | string |  |  |
| prefix | string |  |  |
| url | string |  |  |
| full_title | string |  |  |
| image | string |  |  |
| preposition | string |  |  |
| original | Resource |  |  |

## Participant

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| titile | string |  |  |
| prefix | string |  |  |
| url | string |  |  |
| full_title | string |  |  |
| image | string |  |  |
| preposition | string |  |  |
| original | Resource |  |  |

## Location

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| city | string |  |  |
| region | string |  |  |
| region_code | string |  |  |
| area_code | string |  |  |
| time_zone | string |  |  |
| organization | string |  |  |
| net_speed | string |  | The network speed associated with the IP address. |
| country | string |  |  |
| country_code | string |  |  |
| postal_code | string |  |  |
| latitude | string |  |  |
| longitude | string |  |  |
| metro_code | string |  | The metro code associated with the IP address. These are only available for IP addresses in the US. |
| isp | string |  | The name of the Internet Service Provider associated with the IP address. |

## Retrieve activities

GET**/api/v1/cases/:id/activities.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)
Ordered by created_at (ascending)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| minimum_weight | float |  | Filter activities by their minimum weight |
| since | timestamp |  | Filter activities newer than specified date |
| until | timestamp |  | Filter activities older than specified date |
| sort_order | string |  | `ASC`, `DESC` **Default:**`DESC` |

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 12,
            "activity": "create_case",
            "actor": {
                "name": "user",
                "title": "Simon Blackhouse",
                "prefix": "@",
                "url": "https://brewfictus.kayako.com/user/1",
                "full_title": "Simon Blackhouse",
                "image": "",
                "preposition": null,
                "original": {
                    "id": 1,
                    "resource_type": "user"
                },
                "resource_type": "activity_actor"
            },
            "verb": "create",
            "summary": "<@https://brewfictus.kayako.com/user/1|Phoebe Todd> created <https://brewfictus.kayako.com/case/view/1|Atmosphere Coffee, Inc annual maintenance>",
            "actions": [],
            "object": {
                "id": 1,
                "resource_type": "case"
            },
            "object_actor": null,
            "location": null,
            "place": null,
            "target": null,
            "result": null,
            "in_reply_to": null,
            "participant": null,
            "portal": "API",
            "weight": 0.8,
            "ip_address": null,
            "created_at": "2015-07-27T11:35:09+05:00",
            "resource_type": "activity"
        }
    ],
    "resource": "activity",
    "limit": 10,
    "total_count": 1
}
```




### Cases

Title: Cases - Cases | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/cases/cases/

Published Time: Thu, 15 Feb 2018 07:35:46 GMT

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   CORE
4.   CASES

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| legacy_id | string |  |  |
| subject | string |  |  |
| portal | string |  |  |
| source_channel | [Channel](https://developer.kayako.com/api/v1/cases/cases/#Channels) |  | Channel represents the source from which conversation was originally created. `MAIL`, `HELPCENTER`, `TWITTER`, `MESSENGER`, `FACEBOOK`, `NOTE` |
| last_public_channel | [Channel](https://developer.kayako.com/api/v1/cases/cases/#Channels) |  | Channel represents the last public channel used in conversation reply. `MAIL`, `HELPCENTER`, `TWITTER`, `FACEBOOK` |
| requester | [User](https://developer.kayako.com/api/v1/users/users/) |  |  |
| creator | [User](https://developer.kayako.com/api/v1/users/users/) |  |  |
| identity | [Identity](https://developer.kayako.com/api/v1/users/identities/) |  | `TWITTER`, `FACEBOOK`, `MAIL`, `PHONE` |
| assignee | [User](https://developer.kayako.com/api/v1/users/users/) |  |  |
| assigned_agent | [User](https://developer.kayako.com/api/v1/users/users/) |  |  |
| assigned_team | [Team](https://developer.kayako.com/api/v1/users/teams/) |  |  |
| last_assigned_by | [User](https://developer.kayako.com/api/v1/users/users/) |  |  |
| brand | [Brand](https://developer.kayako.com/api/v1/general/brands/) |  |  |
| status | [Status](https://developer.kayako.com/api/v1/cases/statuses/) |  |  |
| priority | [Priority](https://developer.kayako.com/api/v1/cases/priorities/) |  |  |
| type | [Type](https://developer.kayako.com/api/v1/cases/types/) |  |  |
| read_marker | [Read marker](https://developer.kayako.com/api/v1/cases/cases/#read-marker) |  |  |
| sla_version | [SLA Version](https://developer.kayako.com/api/v1/cases/#sla-version/) |  |  |
| sla_metrics | [SLA Metrics](https://developer.kayako.com/api/v1/cases/cases/#sla-metrics) |  |  |
| form | [Form](https://developer.kayako.com/api/v1/cases/forms/) |  |  |
| custom_fields | Custom Fields |  |  |
| last_replier | [User](https://developer.kayako.com/api/v1/users/users/) |  |  |
| last_replier_identity | [Identity](https://developer.kayako.com/api/v1/users/identities/) |  |  |
| last_completed_by | [User](https://developer.kayako.com/api/v1/users/users/) |  |  |
| last_updated_by | [User](https://developer.kayako.com/api/v1/users/users/) |  |  |
| last_closed_by | [User](https://developer.kayako.com/api/v1/users/users/) |  |  |
| state | string |  | `ACTIVE`, `SUSPENDED`, `TRASH` |
| post_count | integer |  |  |
| has_notes | boolean |  |  |
| pinned_notes_count | integer |  |  |
| has_attachments | boolean |  |  |
| is_merged | boolean |  |  |
| rating | string |  | `GOOD`, `BAD` |
| rating_status | string |  | `UNOFFERED`, `OFFERED`, `RECEIVED` |
| tags | [Tag](https://developer.kayako.com/api/v1/cases/tags/) |  | Get all tags on the conversation. This field is optional and is only returned if parameter `fields` is passed with value `+tags`. Check [here](https://developer.kayako.com/api/v1/reference/partial_output/) for more info. |
| reply_channels | [Channel](https://developer.kayako.com/api/v1/cases/cases/api/v1/cases/cases/#Channels) |  | Get all available channels to reply on a conversation. This field is optional and is only returned if parameter `fields` is passed with value `+reply_channels`. Check [here](https://developer.kayako.com/api/v1/reference/partial_output/) for more info. |
| last_post_status | string |  | `SENT`, `DELIVERED`, `REJECTED`, `SEEN` **Note:**_last\_post\_status_ might be empty where not applicable. |
| last_post_preview | string |  | Preview text of last post on this conversation |
| last_post_type | string |  | `PUBLIC`, `NOTE` |
| last_message_preview | string |  | **This field will be removed very soon. Please use last_post_preview for preview text of last post.** |
| realtime_channel | string |  | Subscribe to this channel for realtime updates |
| last_assigned_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| last_replied_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| last_opened_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| last_pending_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| last_closed_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| last_completed_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| last_agent_activity_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| last_customer_activity_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| last_reply_by_agent_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| last_reply_by_requester_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| latest_assignee_update | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| agent_updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## SLA Version

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| id | integer |  |  |
| title | string |  |  |
| description | string |  |  |
| filters | json |  |  |
| metrics | json |  | Metrics defined with the SLA Version |
| created_at | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |  |  |

## SLA Metric

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| metric_type | string |  | `FIRST_REPLY_TIME`, `NEXT_REPLY_TIME`, `RESOLUTION_TIME` |
| stage | string |  | `ACTIVE`, `PAUSED`, `COMPLETED` |
| is_breached | boolean |  |  |
| due_at | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |  |  |
| started_at | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |  |  |
| completed_at | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |  |  |
| last_paused_at | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |  |  |
| target | [Target](https://developer.kayako.com/api/v1/cases/service_level_agreements/#targets) |  |  |

## Read marker

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| id | integer |  |  |
| last_read_post_id | integer |  |  |
| last_read_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| unread_count | integer |  |  |

## Retrieve all cases

GET**/api/v1/cases.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)
Ordered by updated_at (descending)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| identity_type | string |  | `EMAIL`, `FACEBOOK`, `TWITTER`, `PHONE` |
| identity_value | string |  | Mandatory if identity_type is specified. Should be set as - email if identity_type `EMAIL`, username if identity_type `FACEBOOK` , screenname if identity_type `TWITTER` , phone number if identity_type `PHONE` |
| tags | string |  | Filter conversations based on comma separated tags |
| status | string |  | `NEW`, `OPEN`, `PENDING`, `COMPLETED`, `CLOSED`, `CUSTOM` This argument supports usage of comma separated values |
| priority | integer |  | Include all conversations having priority level less than or equal to provided level |
| start_time | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

**OR**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | For retrieving conversations by ids, pass comma separated ids |

**OR**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| legacy_ids | string |  | The comma separated legacy ids |

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "legacy_id": "YAK-923-46434",
            "subject": "Atmosphere Coffee, Inc annual maintenance",
            "portal": "API",
            "source_channel": {
                "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
                "resource_type": "channel"
            },
            "last_public_channel": {
                "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
                "resource_type": "channel"
            },
            "requester": {
                "id": 2,
                "resource_type": "user"
            },
            "creator": {
                "id": 1,
                "resource_type": "user"
            },
            "identity": {
                "id": 1,
                "resource_type": "identity_email"
            },
            "assigned_agent": {
                "id": 1,
                "resource_type": "user"
            },
            "assigned_team": {
                "id": 1,
                "legacy_id": null,
                "resource_type": "team"
            },
            "last_assigned_by": {
                "id": 1,
                "resource_type": "user"
            },
            "brand": {
                "id": 1,
                "resource_type": "brand"
            },
            "status": {
                "id": 1,
                "resource_type": "case_status"
            },
            "priority": {
                "id": 3,
                "resource_type": "case_priority"
            },
            "type": {
                "id": 1,
                "resource_type": "case_type"
            },
            "read_marker": {
                "id": 1,
                "resource_type": "read_marker"
            },
            "sla_version": {
                "id": 1,
                "resource_type": "sla_version"
            },
            "sla_metrics": [
                {
                    "id": 1,
                    "resource_type": "sla_metric"
                },
                {
                    "id": 2,
                    "resource_type": "sla_metric"
                },
                {
                    "id": 3,
                    "resource_type": "sla_metric"
                }
            ],
            "form": {
                "id": 1,
                "resource_type": "case_form"
            },
            "custom_fields": [
                {
                    "field": {
                        "id": 1,
                        "resource_type": "case_field"
                    },
                    "value": "3",
                    "resource_type": "case_field_value"
                }
            ],
            "last_replier": {
                "id": 1,
                "resource_type": "user"
            },
            "last_replier_identity": {
                "id": 1,
                "resource_type": "identity_email"
            },
            "last_completed_by": null,
            "last_updated_by": null,
            "last_closed_by": null,
            "state": "ACTIVE",
            "post_count": 2,
            "has_notes": false,
            "pinned_notes_count": 0,
            "has_attachments": false,
            "is_merged": false,
            "rating": null,
            "rating_status": "UNOFFERED",
            "last_post_status": "SEEN",
            "last_post_preview": "My HubID is 525862. I'm trying to send a notification email to my salespeople when a contact is assigned to them. All of my other salespeople are receiving the emails fine, but for one person they never arrived. We checked in their SPAM folder, but the...",
            "last_post_type": "PUBLIC",
            "last_message_preview": "My HubID is 525862. I'm trying to send a notification email to my salespeople when a contact is assigned to them. All of my other salespeople are receiving the emails fine, but for one person they never arrived. We checked in their SPAM folder, but the...",
            "realtime_channel": "presence-d6c6a8b31be92885222ee53dde6c99c745c5f4cf77f1bd9dd3519d07fa730c71@v1_cases_1",
            "last_assigned_at": "2015-07-30T06:45:25+05:00",
            "last_replied_at": "2015-07-27T11:35:09+05:00",
            "last_opened_at": null,
            "last_pending_at": null,
            "last_closed_at": null,
            "last_completed_at": null,
            "last_agent_activity_at": null,
            "last_customer_activity_at": "2015-07-30T06:45:25+05:00",
            "last_reply_by_agent_at": null,
            "last_reply_by_requester_at": null,
            "agent_updated_at": null,
            "latest_assignee_update": null,
            "created_at": "2015-07-30T06:45:25+05:00",
            "updated_at": "2015-07-30T06:45:25+05:00",
            "resource_type": "case",
            "resource_url": "https://brewfictus.kayako.com/api/v1/cases/1"
        }
    ],
    "resource": "case",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Retrieve organization conversations

GET**/api/v1/organizations/:id/cases.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)
Ordered by updated_at (descending)

### Request Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| status | string |  | `NEW`, `OPEN`, `PENDING`, `COMPLETED`, `CLOSED`, `CUSTOM` This argument supports usage of comma separated values |
| priority | integer |  | Include all conversations having priority level less than or equal to provided level |

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "legacy_id": "YAK-923-46434",
            "subject": "Atmosphere Coffee, Inc annual maintenance",
            "portal": "API",
            "source_channel": {
                "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
                "resource_type": "channel"
            },
            "last_public_channel": {
                "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
                "resource_type": "channel"
            },
            "requester": {
                "id": 2,
                "resource_type": "user"
            },
            "creator": {
                "id": 1,
                "resource_type": "user"
            },
            "identity": {
                "id": 1,
                "resource_type": "identity_email"
            },
            "assigned_agent": {
                "id": 1,
                "resource_type": "user"
            },
            "assigned_team": {
                "id": 1,
                "legacy_id": null,
                "resource_type": "team"
            },
            "last_assigned_by": {
                "id": 1,
                "resource_type": "user"
            },
            "brand": {
                "id": 1,
                "resource_type": "brand"
            },
            "status": {
                "id": 1,
                "resource_type": "case_status"
            },
            "priority": {
                "id": 3,
                "resource_type": "case_priority"
            },
            "type": {
                "id": 1,
                "resource_type": "case_type"
            },
            "read_marker": {
                "id": 1,
                "resource_type": "read_marker"
            },
            "sla_version": {
                "id": 1,
                "resource_type": "sla_version"
            },
            "sla_metrics": [
                {
                    "id": 1,
                    "resource_type": "sla_metric"
                },
                {
                    "id": 2,
                    "resource_type": "sla_metric"
                },
                {
                    "id": 3,
                    "resource_type": "sla_metric"
                }
            ],
            "form": {
                "id": 1,
                "resource_type": "case_form"
            },
            "custom_fields": [
                {
                    "field": {
                        "id": 1,
                        "resource_type": "case_field"
                    },
                    "value": "3",
                    "resource_type": "case_field_value"
                }
            ],
            "last_replier": {
                "id": 1,
                "resource_type": "user"
            },
            "last_replier_identity": {
                "id": 1,
                "resource_type": "identity_email"
            },
            "last_completed_by": null,
            "last_updated_by": null,
            "last_closed_by": null,
            "state": "ACTIVE",
            "post_count": 2,
            "has_notes": false,
            "pinned_notes_count": 0,
            "has_attachments": false,
            "is_merged": false,
            "rating": null,
            "rating_status": "UNOFFERED",
            "last_post_status": "SEEN",
            "last_post_preview": "My HubID is 525862. I'm trying to send a notification email to my salespeople when a contact is assigned to them. All of my other salespeople are receiving the emails fine, but for one person they never arrived. We checked in their SPAM folder, but the...",
            "last_post_type": "PUBLIC",
            "last_message_preview": "My HubID is 525862. I'm trying to send a notification email to my salespeople when a contact is assigned to them. All of my other salespeople are receiving the emails fine, but for one person they never arrived. We checked in their SPAM folder, but the...",
            "realtime_channel": "presence-d6c6a8b31be92885222ee53dde6c99c745c5f4cf77f1bd9dd3519d07fa730c71@v1_cases_1",
            "last_assigned_at": "2015-07-30T06:45:25+05:00",
            "last_replied_at": "2015-07-27T11:35:09+05:00",
            "last_opened_at": null,
            "last_pending_at": null,
            "last_closed_at": null,
            "last_completed_at": null,
            "last_agent_activity_at": null,
            "last_customer_activity_at": "2015-07-30T06:45:25+05:00",
            "last_reply_by_agent_at": null,
            "last_reply_by_requester_at": null,
            "agent_updated_at": null,
            "latest_assignee_update": null,
            "created_at": "2015-07-30T06:45:25+05:00",
            "updated_at": "2015-07-30T06:45:25+05:00",
            "resource_type": "case",
            "resource_url": "https://brewfictus.kayako.com/api/v1/cases/1"
        }
    ],
    "resource": "case",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Retrieve a conversation

GET**/api/v1/cases/:id.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "legacy_id": "YAK-923-46434",
        "subject": "Atmosphere Coffee, Inc annual maintenance",
        "portal": "API",
        "source_channel": {
            "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
            "resource_type": "channel"
        },
        "last_public_channel": {
            "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
            "resource_type": "channel"
        },
        "requester": {
            "id": 2,
            "resource_type": "user"
        },
        "creator": {
            "id": 1,
            "resource_type": "user"
        },
        "identity": {
            "id": 1,
            "resource_type": "identity_email"
        },
        "assigned_agent": {
            "id": 1,
            "resource_type": "user"
        },
        "assigned_team": {
            "id": 1,
            "legacy_id": null,
            "resource_type": "team"
        },
        "last_assigned_by": {
            "id": 1,
            "resource_type": "user"
        },
        "brand": {
            "id": 1,
            "resource_type": "brand"
        },
        "status": {
            "id": 1,
            "resource_type": "case_status"
        },
        "priority": {
            "id": 3,
            "resource_type": "case_priority"
        },
        "type": {
            "id": 1,
            "resource_type": "case_type"
        },
        "read_marker": {
            "id": 1,
            "resource_type": "read_marker"
        },
        "sla_version": {
            "id": 1,
            "resource_type": "sla_version"
        },
        "sla_metrics": [
            {
                "id": 1,
                "resource_type": "sla_metric"
            },
            {
                "id": 2,
                "resource_type": "sla_metric"
            },
            {
                "id": 3,
                "resource_type": "sla_metric"
            }
        ],
        "form": {
            "id": 1,
            "resource_type": "case_form"
        },
        "custom_fields": [
            {
                "field": {
                    "id": 1,
                    "resource_type": "case_field"
                },
                "value": "3",
                "resource_type": "case_field_value"
            }
        ],
        "last_replier": {
            "id": 1,
            "resource_type": "user"
        },
        "last_replier_identity": {
            "id": 1,
            "resource_type": "identity_email"
        },
        "last_completed_by": null,
        "last_updated_by": null,
        "last_closed_by": null,
        "state": "ACTIVE",
        "post_count": 2,
        "has_notes": false,
        "pinned_notes_count": 0,
        "has_attachments": false,
        "is_merged": false,
        "rating": null,
        "rating_status": "UNOFFERED",
        "last_post_status": "SEEN",
        "last_post_preview": "My HubID is 525862. I'm trying to send a notification email to my salespeople when a contact is assigned to them. All of my other salespeople are receiving the emails fine, but for one person they never arrived. We checked in their SPAM folder, but the...",
        "last_post_type": "PUBLIC",
        "last_message_preview": "My HubID is 525862. I'm trying to send a notification email to my salespeople when a contact is assigned to them. All of my other salespeople are receiving the emails fine, but for one person they never arrived. We checked in their SPAM folder, but the...",
        "realtime_channel": "presence-d6c6a8b31be92885222ee53dde6c99c745c5f4cf77f1bd9dd3519d07fa730c71@v1_cases_1",
        "last_assigned_at": "2015-07-30T06:45:25+05:00",
        "last_replied_at": "2015-07-27T11:35:09+05:00",
        "last_opened_at": null,
        "last_pending_at": null,
        "last_closed_at": null,
        "last_completed_at": null,
        "last_agent_activity_at": null,
        "last_customer_activity_at": "2015-07-30T06:45:25+05:00",
        "last_reply_by_agent_at": null,
        "last_reply_by_requester_at": null,
        "agent_updated_at": null,
        "latest_assignee_update": null,
        "created_at": "2015-07-30T06:45:25+05:00",
        "updated_at": "2015-07-30T06:45:25+05:00",
        "resource_type": "case",
        "resource_url": "https://brewfictus.kayako.com/api/v1/cases/1"
    },
    "resource": "case"
}
```

## Channels

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| uuid | string |  |  |
| type | string |  | `HELPCENTER`, `MAIL`, `FACEBOOK`, `TWITTER`, `MESSENGER`, `NOTE` |
| character_limit | integer |  |  |
| account | Resource |  |  |

## Retrieve for new conversation

GET**/api/v1/cases/channels.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| user_id | integer |  | Conversation requester id |

### Response

```
{
    "status": 200,
    "data": [
        {
            "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
            "type": "MAIL",
            "character_limit": null,
            "account": {
                "id": 1,
                "resource_type": "mailbox"
            },
            "resource_type": "channel"
        },
        {
            "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
            "type": "FACEBOOK",
            "character_limit": null,
            "account": {
                "id": "876423285750729",
                "resource_type": "facebook_page"
            },
            "resource_type": "channel"
        },
        {
            "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
            "type": "TWITTER",
            "character_limit": 127,
            "account": {
                "id": "3155953718",
                "resource_type": "twitter_account"
            },
            "resource_type": "channel"
        },
        {
            "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
            "type": "NOTE",
            "character_limit": null,
            "account": null,
            "resource_type": "channel"
        }
    ],
    "resource": "channel",
    "total_count": 4
}
```

## Retrieve for a reply

GET**/api/v1/cases/:id/reply/channels.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Response

```
{
    "status": 200,
    "data": [
        {
            "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
            "type": "MAIL",
            "character_limit": null,
            "account": {
                "id": 1,
                "resource_type": "mailbox"
            },
            "resource_type": "channel"
        },
        {
            "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
            "type": "TWITTER",
            "character_limit": 127,
            "account": {
                "id": "3155953718",
                "resource_type": "twitter_account"
            },
            "resource_type": "channel"
        },
        {
            "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
            "type": "NOTE",
            "character_limit": null,
            "account": null,
            "resource_type": "channel"
        }
    ],
    "resource": "channel",
    "total_count": 3
}
```

## Retrieve used in conversation

GET**/api/v1/cases/:id/channels.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Response

```
{
    "status": 200,
    "data": [
        {
            "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
            "type": "MAIL",
            "character_limit": null,
            "account": {
                "id": 1,
                "resource_type": "mailbox"
            },
            "resource_type": "channel"
        },
        {
            "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
            "type": "FACEBOOK",
            "character_limit": null,
            "account": {
                "id": "876423285750729",
                "resource_type": "facebook_page"
            },
            "resource_type": "channel"
        },
        {
            "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
            "type": "TWITTER",
            "character_limit": 127,
            "account": {
                "id": "3155953718",
                "resource_type": "twitter_account"
            },
            "resource_type": "channel"
        },
        {
            "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
            "type": "NOTE",
            "character_limit": null,
            "account": null,
            "resource_type": "channel"
        },
        {
            "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
            "type": "HELPCENTER",
            "character_limit": null,
            "account": null,
            "resource_type": "channel"
        }
    ],
    "resource": "channel",
    "total_count": 5
}
```

## Add a conversation

POST**/api/v1/cases.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| subject | string |  |  |
| contents | string |  |  |
| legacy_id | string |  |  |
| requester_id | integer |  |  |
| channel | string |  | `MAIL`, `TWITTER`, `FACEBOOK`, `NOTE` |
| channel_id | integer |  | Not required for channel `NOTE` |
| channel_options | string |  | **MAIL:** Allowed options are _cc_ and _html_ **_cc_:** comma separated email addresses **_html_:** if set to true then system will parse the contents through the purify service and render them **Example:** `{"cc":"ben.pigford@brewfictus.com,bekki.park@brewfictus.com", "html":true}` **TWITTER:** Allowed options is _type_ **_type_:** allowed values are `REPLY`, `DM`, `REPLY_WITH_PROMPT`**Default:**`REPLY` **Note:** for type `REPLY_WITH_PROMPT` please enable [Receive Direct Messages from Anyone](https://business.twitter.com/en/help/campaign-editing-and-optimization/public-to-private-conversation.html) setting for Twitter account **Example:** `{"type":"REPLY_WITH_PROMPT"}` **NOTE:** Allowed option is _html_ **_html_:** if set to true then system will parse the contents through the purify service and render them **Example:** `{"html":true}` |
| priority_id | integer |  |  |
| type_id | integer |  |  |
| assigned_team_id | integer |  |  |
| assigned_agent_id | integer |  |  |
| status_id | integer |  |  |
| form_id | integer |  |  |
| field_values | array |  | This operation will add field values with requested field keys. **Format:** field_values[field_key] = field_value field_values[field_key] = field_value **For Options:** CSV options are accepted for multi-select |
| tags | string |  | Comma separated tags |
| attachment | [multipart/form-data](https://developer.kayako.com/api/v1/cases/cases/#) |  |  |
| attachment_file_ids | [CSV](https://developer.kayako.com/api/v1/cases/cases/#) |  |  |
| client_id | string |  | If provided, this value will be returned in the [Posts](https://developer.kayako.com/api/v1/cases/cases/#Posts) resource. Used to identify messages reflected back from the server. |

### Request

```
curl -X POST https://brewfictus.kayako.com/api/v1/cases \
     -d '{"subject":"My coffee machine is not working","contents":"Hey! I am facing issue from last week kindly look into it on priority","channel":"MAIL","channel_id":"1","requester_id":"2","priority_id":"3","type_id":"1"}' \
     -H "Content-Type: application/json" \
     -u 'jordan.mitchell@brewfictus.com:jmit6#lsXo'
```

### Response

```
{
    "status": 201,
    "data": {
        "id": 1,
        "legacy_id": "YAK-923-46434",
        "subject": "Atmosphere Coffee, Inc annual maintenance",
        "portal": "API",
        "source_channel": {
            "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
            "resource_type": "channel"
        },
        "last_public_channel": {
            "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
            "resource_type": "channel"
        },
        "requester": {
            "id": 2,
            "resource_type": "user"
        },
        "creator": {
            "id": 1,
            "resource_type": "user"
        },
        "identity": {
            "id": 1,
            "resource_type": "identity_email"
        },
        "assigned_agent": {
            "id": 1,
            "resource_type": "user"
        },
        "assigned_team": {
            "id": 1,
            "legacy_id": null,
            "resource_type": "team"
        },
        "last_assigned_by": {
            "id": 1,
            "resource_type": "user"
        },
        "brand": {
            "id": 1,
            "resource_type": "brand"
        },
        "status": {
            "id": 1,
            "resource_type": "case_status"
        },
        "priority": {
            "id": 3,
            "resource_type": "case_priority"
        },
        "type": {
            "id": 1,
            "resource_type": "case_type"
        },
        "read_marker": {
            "id": 1,
            "resource_type": "read_marker"
        },
        "sla_version": {
            "id": 1,
            "resource_type": "sla_version"
        },
        "sla_metrics": [
            {
                "id": 1,
                "resource_type": "sla_metric"
            },
            {
                "id": 2,
                "resource_type": "sla_metric"
            },
            {
                "id": 3,
                "resource_type": "sla_metric"
            }
        ],
        "form": {
            "id": 1,
            "resource_type": "case_form"
        },
        "custom_fields": [
            {
                "field": {
                    "id": 1,
                    "resource_type": "case_field"
                },
                "value": "3",
                "resource_type": "case_field_value"
            }
        ],
        "last_replier": {
            "id": 1,
            "resource_type": "user"
        },
        "last_replier_identity": {
            "id": 1,
            "resource_type": "identity_email"
        },
        "last_completed_by": null,
        "last_updated_by": null,
        "last_closed_by": null,
        "state": "ACTIVE",
        "post_count": 2,
        "has_notes": false,
        "pinned_notes_count": 0,
        "has_attachments": false,
        "is_merged": false,
        "rating": null,
        "rating_status": "UNOFFERED",
        "last_post_status": "SEEN",
        "last_post_preview": "My HubID is 525862. I'm trying to send a notification email to my salespeople when a contact is assigned to them. All of my other salespeople are receiving the emails fine, but for one person they never arrived. We checked in their SPAM folder, but the...",
        "last_post_type": "PUBLIC",
        "last_message_preview": "My HubID is 525862. I'm trying to send a notification email to my salespeople when a contact is assigned to them. All of my other salespeople are receiving the emails fine, but for one person they never arrived. We checked in their SPAM folder, but the...",
        "realtime_channel": "presence-d6c6a8b31be92885222ee53dde6c99c745c5f4cf77f1bd9dd3519d07fa730c71@v1_cases_1",
        "last_assigned_at": "2015-07-30T06:45:25+05:00",
        "last_replied_at": "2015-07-27T11:35:09+05:00",
        "last_opened_at": null,
        "last_pending_at": null,
        "last_closed_at": null,
        "last_completed_at": null,
        "last_agent_activity_at": null,
        "last_customer_activity_at": "2015-07-30T06:45:25+05:00",
        "last_reply_by_agent_at": null,
        "last_reply_by_requester_at": null,
        "agent_updated_at": null,
        "latest_assignee_update": null,
        "created_at": "2015-07-30T06:45:25+05:00",
        "updated_at": "2015-07-30T06:45:25+05:00",
        "resource_type": "case",
        "resource_url": "https://brewfictus.kayako.com/api/v1/cases/1"
    },
    "resource": "case"
}
```

## Bulk add cases

POST**/api/v1/bulk/cases.json**

### Information

You can insert a maximum of 200 cases at a time

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| cases | array |  | Array of cases to be inserted |

### Case

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| subject | string |  |  |
| contents | string |  |  |
| legacy_id | string |  |  |
| requester_id | integer |  |  |
| channel | string |  | `MAIL`, `NOTE` |
| channel_id | integer |  | Not required for channel `NOTE` |
| channel_options | string |  | **MAIL:** Allowed options are _cc_ and _html_ **_cc_:** comma separated email addresses **_html_:** if set to true then system will parse the contents through the purify service and render them **Example:** `{"cc":"ben.pigford@brewfictus.com,bekki.park@brewfictus.com", "html":true}` **TWITTER:** Allowed options is _type_ **_type_:** allowed values are `REPLY`, `DM`, `REPLY_WITH_PROMPT`**Default:**`REPLY` **Note:** for type `REPLY_WITH_PROMPT` please enable [Receive Direct Messages from Anyone](https://business.twitter.com/en/help/campaign-editing-and-optimization/public-to-private-conversation.html) setting for Twitter account **Example:** `{"type":"REPLY_WITH_PROMPT"}` **NOTE:** Allowed option is _html_ **_html_:** if set to true then system will parse the contents through the purify service and render them **Example:** `{"html":true}` |
| priority_id | integer |  |  |
| type_id | integer |  |  |
| assigned_team_id | integer |  |  |
| assigned_agent_id | integer |  |  |
| status_id | integer |  |  |
| form_id | integer |  |  |
| field_values | array |  | This operation will add field values with requested field keys. **Format:** field_values[field_key] = field_value field_values[field_key] = field_value **For Options:** CSV options are accepted for multi-select |
| tags | string |  | Comma separated tags |
| attachment_file_ids | [CSV](https://developer.kayako.com/api/v1/cases/cases/#) |  |  |
| posts |  |  | Array of case posts to be inserted |
| client_id | string |  | If provided, this value will be returned in the [Posts](https://developer.kayako.com/api/v1/cases/cases/#Posts) resource. Used to identify messages reflected back from the server. |
| created_at | string |  | Timestamp in format `YYYY-MM-DDThh:mm:ssTZD` |
| updated_at | string |  | Timestamp in format `YYYY-MM-DDThh:mm:ssTZD` |

### Post

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| contents | string |  |  |
| channel | string |  |  |
| channel | string |  | `MAIL`, `NOTE` |
| channel_id | integer |  | Not required for channel `NOTE` |
| channel_options | string |  | **MAIL:** Allowed options are _cc_ and _html_ **_cc_:** comma separated email addresses **_html_:** if set to true then system will parse the contents through the purify service and render them **Example:** `{"cc":"ben.pigford@brewfictus.com,bekki.park@brewfictus.com", "html":true}` **TWITTER:** Allowed options is _type_ **_type_:** allowed values are `REPLY`, `DM`, `REPLY_WITH_PROMPT`**Default:**`REPLY` **Note:** for type `REPLY_WITH_PROMPT` please enable [Receive Direct Messages from Anyone](https://business.twitter.com/en/help/campaign-editing-and-optimization/public-to-private-conversation.html) setting for Twitter account **Example:** `{"type":"REPLY_WITH_PROMPT"}` **NOTE:** Allowed option is _html_ **_html_:** if set to true then system will parse the contents through the purify service and render them **Example:** `{"html":true}` |
| attachment_file_ids | [CSV](https://developer.kayako.com/api/v1/cases/cases/#) |  |  |
| created_at | string |  | Timestamp in format `YYYY-MM-DDThh:mm:ssTZD` |
| updated_at | string |  | Timestamp in format `YYYY-MM-DDThh:mm:ssTZD` |

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| partial_import | boolean |  | By default, even if a single record is invalid, the entire batch is dropped. However, if this parameter is set to `true`, all the records with no validation errors will be inserted while the invalid records will be returned back. |

### Request

```
curl -X POST https://brewfictus.kayako.com/api/v1/bulk/cases \
    -d '{"cases": [{"subject": "Sample Test 1", "creator_id": 1, "contents": "Sample Content", "requester_id": 1, "channel": "MAIL", "channel_id": 1, "legacy_id": "example_5", "posts": [{"creator_id": 1, "contents": "Sample Post", "channel": "MAIL", "channel_id": 1}]}]}' \
    -H "Content-Type: application/json"
```

### Response

```
{
    "status": 202,
    "data": {
        "id": 1,
        "status": "PENDING",
        "created_at": "2015-07-30T06:45:25+05:00",
        "updated_at": "2015-07-30T06:45:25+05:00",
        "resource_type": "bulk_job",
        "resource_url": "https://brewfictus.kayako.com/api/v1/jobs/1"
    },
    "resource": "job"
}
```

## Update a conversation

PUT**/api/v1/cases/:id.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| subject | string |  |  |
| requester_id | integer |  |  |
| assigned_team_id | integer |  |  |
| brand_id | integer |  |  |
| assigned_agent_id | integer |  |  |
| status_id | integer |  |  |
| priority_id | integer |  |  |
| type_id | integer |  |  |
| form_id | integer |  |  |
| state | string |  | `TRASH` |
| field_values | array |  | This operation will add or update existing field values with requested field keys. **Format:** field_values[field_key] = field_value field_values[field_key] = field_value **For Options:** CSV options are accepted for multi-select **WARNING:** All options must be passed. The options which are not passed will be removed. |
| tags | string |  | Comma separated tags |

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "legacy_id": "YAK-923-46434",
        "subject": "Atmosphere Coffee, Inc annual maintenance",
        "portal": "API",
        "source_channel": {
            "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
            "resource_type": "channel"
        },
        "last_public_channel": {
            "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
            "resource_type": "channel"
        },
        "requester": {
            "id": 2,
            "resource_type": "user"
        },
        "creator": {
            "id": 1,
            "resource_type": "user"
        },
        "identity": {
            "id": 1,
            "resource_type": "identity_email"
        },
        "assigned_agent": {
            "id": 1,
            "resource_type": "user"
        },
        "assigned_team": {
            "id": 1,
            "legacy_id": null,
            "resource_type": "team"
        },
        "last_assigned_by": {
            "id": 1,
            "resource_type": "user"
        },
        "brand": {
            "id": 1,
            "resource_type": "brand"
        },
        "status": {
            "id": 1,
            "resource_type": "case_status"
        },
        "priority": {
            "id": 3,
            "resource_type": "case_priority"
        },
        "type": {
            "id": 1,
            "resource_type": "case_type"
        },
        "read_marker": {
            "id": 1,
            "resource_type": "read_marker"
        },
        "sla_version": {
            "id": 1,
            "resource_type": "sla_version"
        },
        "sla_metrics": [
            {
                "id": 1,
                "resource_type": "sla_metric"
            },
            {
                "id": 2,
                "resource_type": "sla_metric"
            },
            {
                "id": 3,
                "resource_type": "sla_metric"
            }
        ],
        "form": {
            "id": 1,
            "resource_type": "case_form"
        },
        "custom_fields": [
            {
                "field": {
                    "id": 1,
                    "resource_type": "case_field"
                },
                "value": "3",
                "resource_type": "case_field_value"
            }
        ],
        "last_replier": {
            "id": 1,
            "resource_type": "user"
        },
        "last_replier_identity": {
            "id": 1,
            "resource_type": "identity_email"
        },
        "last_completed_by": null,
        "last_updated_by": null,
        "last_closed_by": null,
        "state": "ACTIVE",
        "post_count": 2,
        "has_notes": false,
        "pinned_notes_count": 0,
        "has_attachments": false,
        "is_merged": false,
        "rating": null,
        "rating_status": "UNOFFERED",
        "last_post_status": "SEEN",
        "last_post_preview": "My HubID is 525862. I'm trying to send a notification email to my salespeople when a contact is assigned to them. All of my other salespeople are receiving the emails fine, but for one person they never arrived. We checked in their SPAM folder, but the...",
        "last_post_type": "PUBLIC",
        "last_message_preview": "My HubID is 525862. I'm trying to send a notification email to my salespeople when a contact is assigned to them. All of my other salespeople are receiving the emails fine, but for one person they never arrived. We checked in their SPAM folder, but the...",
        "realtime_channel": "presence-d6c6a8b31be92885222ee53dde6c99c745c5f4cf77f1bd9dd3519d07fa730c71@v1_cases_1",
        "last_assigned_at": "2015-07-30T06:45:25+05:00",
        "last_replied_at": "2015-07-27T11:35:09+05:00",
        "last_opened_at": null,
        "last_pending_at": null,
        "last_closed_at": null,
        "last_completed_at": null,
        "last_agent_activity_at": null,
        "last_customer_activity_at": "2015-07-30T06:45:25+05:00",
        "last_reply_by_agent_at": null,
        "last_reply_by_requester_at": null,
        "agent_updated_at": null,
        "latest_assignee_update": null,
        "created_at": "2015-07-30T06:45:25+05:00",
        "updated_at": "2015-07-30T06:45:25+05:00",
        "resource_type": "case",
        "resource_url": "https://brewfictus.kayako.com/api/v1/cases/1"
    },
    "resource": "case"
}
```

## Bulk update conversation

PUT**/api/v1/cases.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| requester_id | integer |  |  |
| assigned_team_id | integer |  |  |
| assigned_agent_id | integer |  |  |
| status_id | integer |  |  |
| priority_id | integer |  |  |
| type_id | integer |  |  |
| state | string |  | `TRASH` |
| reply | string |  |  |
| notes | string |  |  |
| tags | string |  | The comma separated tags applied to these conversations |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```

## Mark conversation as trash

PUT**/api/v1/cases/:id/trash.json**

### Information

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "legacy_id": "YAK-923-46434",
        "subject": "Atmosphere Coffee, Inc annual maintenance",
        "portal": "API",
        "source_channel": {
            "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
            "resource_type": "channel"
        },
        "last_public_channel": {
            "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
            "resource_type": "channel"
        },
        "requester": {
            "id": 2,
            "resource_type": "user"
        },
        "creator": {
            "id": 1,
            "resource_type": "user"
        },
        "identity": {
            "id": 1,
            "resource_type": "identity_email"
        },
        "assigned_agent": {
            "id": 1,
            "resource_type": "user"
        },
        "assigned_team": {
            "id": 1,
            "legacy_id": null,
            "resource_type": "team"
        },
        "last_assigned_by": {
            "id": 1,
            "resource_type": "user"
        },
        "brand": {
            "id": 1,
            "resource_type": "brand"
        },
        "status": {
            "id": 1,
            "resource_type": "case_status"
        },
        "priority": {
            "id": 3,
            "resource_type": "case_priority"
        },
        "type": {
            "id": 1,
            "resource_type": "case_type"
        },
        "read_marker": {
            "id": 1,
            "resource_type": "read_marker"
        },
        "sla_version": {
            "id": 1,
            "resource_type": "sla_version"
        },
        "sla_metrics": [
            {
                "id": 1,
                "resource_type": "sla_metric"
            },
            {
                "id": 2,
                "resource_type": "sla_metric"
            },
            {
                "id": 3,
                "resource_type": "sla_metric"
            }
        ],
        "form": {
            "id": 1,
            "resource_type": "case_form"
        },
        "custom_fields": [
            {
                "field": {
                    "id": 1,
                    "resource_type": "case_field"
                },
                "value": "3",
                "resource_type": "case_field_value"
            }
        ],
        "last_replier": {
            "id": 1,
            "resource_type": "user"
        },
        "last_replier_identity": {
            "id": 1,
            "resource_type": "identity_email"
        },
        "last_completed_by": null,
        "last_updated_by": null,
        "last_closed_by": null,
        "state": "ACTIVE",
        "post_count": 2,
        "has_notes": false,
        "pinned_notes_count": 0,
        "has_attachments": false,
        "is_merged": false,
        "rating": null,
        "rating_status": "UNOFFERED",
        "last_post_status": "SEEN",
        "last_post_preview": "My HubID is 525862. I'm trying to send a notification email to my salespeople when a contact is assigned to them. All of my other salespeople are receiving the emails fine, but for one person they never arrived. We checked in their SPAM folder, but the...",
        "last_post_type": "PUBLIC",
        "last_message_preview": "My HubID is 525862. I'm trying to send a notification email to my salespeople when a contact is assigned to them. All of my other salespeople are receiving the emails fine, but for one person they never arrived. We checked in their SPAM folder, but the...",
        "realtime_channel": "presence-d6c6a8b31be92885222ee53dde6c99c745c5f4cf77f1bd9dd3519d07fa730c71@v1_cases_1",
        "last_assigned_at": "2015-07-30T06:45:25+05:00",
        "last_replied_at": "2015-07-27T11:35:09+05:00",
        "last_opened_at": null,
        "last_pending_at": null,
        "last_closed_at": null,
        "last_completed_at": null,
        "last_agent_activity_at": null,
        "last_customer_activity_at": "2015-07-30T06:45:25+05:00",
        "last_reply_by_agent_at": null,
        "last_reply_by_requester_at": null,
        "agent_updated_at": null,
        "latest_assignee_update": null,
        "created_at": "2015-07-30T06:45:25+05:00",
        "updated_at": "2015-07-30T06:45:25+05:00",
        "resource_type": "case",
        "resource_url": "https://brewfictus.kayako.com/api/v1/cases/1"
    },
    "resource": "case"
}
```

## Bulk trash conversations

PUT**/api/v1/cases/trash.json**

### Information

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Response

```
{
    "status": 200,
    "total_count": 1
}
```

## Empty trash

DELETE**/api/v1/cases/trash.json**

### Information

Allowed for Admins & Owners

### Response

```
{
    "status": 200
}
```

## Restore a conversations

PUT**/api/v1/cases/:id/restore.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "legacy_id": "YAK-923-46434",
        "subject": "Atmosphere Coffee, Inc annual maintenance",
        "portal": "API",
        "source_channel": {
            "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
            "resource_type": "channel"
        },
        "last_public_channel": {
            "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
            "resource_type": "channel"
        },
        "requester": {
            "id": 2,
            "resource_type": "user"
        },
        "creator": {
            "id": 1,
            "resource_type": "user"
        },
        "identity": {
            "id": 1,
            "resource_type": "identity_email"
        },
        "assigned_agent": {
            "id": 1,
            "resource_type": "user"
        },
        "assigned_team": {
            "id": 1,
            "legacy_id": null,
            "resource_type": "team"
        },
        "last_assigned_by": {
            "id": 1,
            "resource_type": "user"
        },
        "brand": {
            "id": 1,
            "resource_type": "brand"
        },
        "status": {
            "id": 1,
            "resource_type": "case_status"
        },
        "priority": {
            "id": 3,
            "resource_type": "case_priority"
        },
        "type": {
            "id": 1,
            "resource_type": "case_type"
        },
        "read_marker": {
            "id": 1,
            "resource_type": "read_marker"
        },
        "sla_version": {
            "id": 1,
            "resource_type": "sla_version"
        },
        "sla_metrics": [
            {
                "id": 1,
                "resource_type": "sla_metric"
            },
            {
                "id": 2,
                "resource_type": "sla_metric"
            },
            {
                "id": 3,
                "resource_type": "sla_metric"
            }
        ],
        "form": {
            "id": 1,
            "resource_type": "case_form"
        },
        "custom_fields": [
            {
                "field": {
                    "id": 1,
                    "resource_type": "case_field"
                },
                "value": "3",
                "resource_type": "case_field_value"
            }
        ],
        "last_replier": {
            "id": 1,
            "resource_type": "user"
        },
        "last_replier_identity": {
            "id": 1,
            "resource_type": "identity_email"
        },
        "last_completed_by": null,
        "last_updated_by": null,
        "last_closed_by": null,
        "state": "ACTIVE",
        "post_count": 2,
        "has_notes": false,
        "pinned_notes_count": 0,
        "has_attachments": false,
        "is_merged": false,
        "rating": null,
        "rating_status": "UNOFFERED",
        "last_post_status": "SEEN",
        "last_post_preview": "My HubID is 525862. I'm trying to send a notification email to my salespeople when a contact is assigned to them. All of my other salespeople are receiving the emails fine, but for one person they never arrived. We checked in their SPAM folder, but the...",
        "last_post_type": "PUBLIC",
        "last_message_preview": "My HubID is 525862. I'm trying to send a notification email to my salespeople when a contact is assigned to them. All of my other salespeople are receiving the emails fine, but for one person they never arrived. We checked in their SPAM folder, but the...",
        "realtime_channel": "presence-d6c6a8b31be92885222ee53dde6c99c745c5f4cf77f1bd9dd3519d07fa730c71@v1_cases_1",
        "last_assigned_at": "2015-07-30T06:45:25+05:00",
        "last_replied_at": "2015-07-27T11:35:09+05:00",
        "last_opened_at": null,
        "last_pending_at": null,
        "last_closed_at": null,
        "last_completed_at": null,
        "last_agent_activity_at": null,
        "last_customer_activity_at": "2015-07-30T06:45:25+05:00",
        "last_reply_by_agent_at": null,
        "last_reply_by_requester_at": null,
        "agent_updated_at": null,
        "latest_assignee_update": null,
        "created_at": "2015-07-30T06:45:25+05:00",
        "updated_at": "2015-07-30T06:45:25+05:00",
        "resource_type": "case",
        "resource_url": "https://brewfictus.kayako.com/api/v1/cases/1"
    },
    "resource": "case"
}
```

## Posts

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| uuid | string |  |  |
| client_id | string |  | `client_id` is provided by the client when creating a message. Can be used to identify messages reflected from the server back to the originating entity. This value may be `null` if not supplied by the client. Since this is only useful for realtime communication, older values might be erased periodically. |
| subject | string |  |  |
| contents | string |  |  |
| creator | [User](https://developer.kayako.com/api/v1/users/users/) | [Trigger](https://developer.kayako.com/api/v1/automation/triggers/) | [Monitor](https://developer.kayako.com/api/v1/automation/monitors/) |  | The entity that created this post. For all user actions, this will be a `user` resource. If triggered by automations, it will be either a `monitor` or `trigger` resource. Might be `null` for actions performed by the system. |
| identity | [Identity](https://developer.kayako.com/api/v1/users/identities/) |  | For Trigger & Monitor the Identity would be `null` |
| source_channel | [Channel](https://developer.kayako.com/api/v1/cases/cases/#Channels) |  | Channel represents the source from which post was originally created. `MAIL`, `HELPCENTER`, `TWITTER`, `MESSENGER`, `FACEBOOK`, `NOTE` For activities the channel would be `null` |
| attachments | [Attachments](https://developer.kayako.com/api/v1/cases/cases/#attachments) |  |  |
| download_all | string |  |  |
| destination_medium | string |  | `MAIL`, `MESSENGER` Applicable for agent reply via `MAIL` channel. This value will be `null` for agent reply via other channels and for customer reply |
| source | string |  | `API`, `AGENT`, `MAIL`, `MESSENGER`, `MOBILE`, `HELPCENTER` |
| metadata | array |  | Metadata will be in key - value pair |
| original | Resource |  |  |
| post_status | string |  | `SENT`, `DELIVERED`, `REJECTED`, `SEEN` **Default:**`SENT` |
| post_status_reject_type | string |  | `BOUNCE`, `BLOCKED`, `DROPPED`, `DEFERRED`, `EXPIRED`, `ERROR` **Note:** This field applicable for `REJECTED` post_status |
| post_status_reject_reason | string |  | Reject reason from MTA **Note:** This field applicable for `REJECTED` post_status |
| post_status_updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Shadow posts

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| uuid | string |  |  |
| subject | string |  |  |
| contents | string |  |  |
| creator | [User](https://developer.kayako.com/api/v1/users/users/) |  | Original post creator (agent/customer) |
| identity | [Identity](https://developer.kayako.com/api/v1/users/identities/) |  | Original post creator identity |
| original_post | Resource |  |  |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Attachments

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| size | integer |  |  |
| width | integer |  | Only if the attachment is image |
| height | integer |  | Only if the attachment is image |
| type | string |  | Mime-type of the file |
| content_id | string |  | Content ID used for inline attachment |
| alt | string |  |  |
| url | string |  | The URL to view the attachment |
| url_download | string |  | The URL to download the attachment |
| thumbnails | [Thumbnails](https://developer.kayako.com/api/v1/cases/cases/#thumbnails) |  |  |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Thumbnails

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| size | integer |  |  |
| width | integer |  |  |
| height | integer |  |  |
| type | string |  | Mime-type of the file |
| url | string |  | The URL to view the thumbnail |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Email Original

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| id | integer |  |  |
| subject | string |  |  |
| from | string |  |  |
| to | string |  |  |
| received_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| html_content | string |  | The original html associated with the mail |
| striped_html | string |  | The html associated with the mail with quoted text striped out |
| source_content | string |  | Associated headers with the mail |

## Retrieve conversation posts

GET**/api/v1/cases/:id/posts.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)
Ordered by id (descending)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| after_id | integer |  |  |
| before_id | integer |  |  |
| filters | string |  | Filter posts based on `ALL`, `ACTIVITIES`, `MESSAGES`, `NOTES`, `SHADOW_POSTS`, `CHAT_MESSAGES`, `FACEBOOK_POSTS`, `FACEBOOK_POST_COMMENTS`, `FACEBOOK_MESSAGES`, `TWEETS`, `TWITTER_MESSAGES` |

By default posts will be returned without activities. To retrieve posts with activities use `ALL`. 

 At a time either after_id or before_id is allowed.

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "uuid": "0da0b7df-9528-4e76-af3e-b7419c61f400",
            "client_id": "93a236f0-edac-4b5a-8747-14140da7d4dc",
            "subject": "Customer is using Honey - Blend. So communicate accordingly",
            "contents": "Customer is using Honey - Blend. So communicate accordingly",
            "creator": {
                "id": 1,
                "resource_type": "user"
            },
            "identity": null,
            "source_channel": null,
            "attachments": [],
            "download_all": null,
            "destination_medium": "MESSENGER",
            "source": "MAIL",
            "metadata": {
                "user_agent": "Chrome",
                "page_url": ""
            },
            "original": {
                "id": 1,
                "resource_type": "case_message"
            },
            "post_status": "SENT",
            "post_status_reject_type": null,
            "post_status_reject_reason": null,
            "post_status_updated_at": "2016-11-08T18:44:27+00:00",
            "created_at": "2016-02-17T08:20:18+05:00",
            "updated_at": "2016-02-17T08:20:18+05:00",
            "resource_type": "post",
            "resource_url": "https://brewfictus.kayako.com/api/v1/cases/posts/1"
        }
    ],
    "resource": "post",
    "limit": 10,
    "total_count": 1
}
```

## Retrieve a post

GET**/api/v1/cases/posts/:id.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "uuid": "0da0b7df-9528-4e76-af3e-b7419c61f400",
        "client_id": "93a236f0-edac-4b5a-8747-14140da7d4dc",
        "subject": "Customer is using Honey - Blend. So communicate accordingly",
        "contents": "Customer is using Honey - Blend. So communicate accordingly",
        "creator": {
            "id": 1,
            "resource_type": "user"
        },
        "identity": null,
        "source_channel": null,
        "attachments": [],
        "download_all": null,
        "destination_medium": "MESSENGER",
        "source": "MAIL",
        "metadata": {
            "user_agent": "Chrome",
            "page_url": ""
        },
        "original": {
            "id": 1,
            "resource_type": "case_message"
        },
        "post_status": "SENT",
        "post_status_reject_type": null,
        "post_status_reject_reason": null,
        "post_status_updated_at": "2016-11-08T18:44:27+00:00",
        "created_at": "2016-02-17T08:20:18+05:00",
        "updated_at": "2016-02-17T08:20:18+05:00",
        "resource_type": "post",
        "resource_url": "https://brewfictus.kayako.com/api/v1/cases/posts/1"
    },
    "resource": "post"
}
```

## Retrieve a original email

GET**/api/v1/cases/posts/:id/email_original.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Response

```
{
    "status": 200,
    "data": {
        "id": 24,
        "subject": "Re: Is there some one technical in your team who can handle reports for us?",
        "from": "hari@gmail.com",
        "to": "support@brewfictus.kayako.com",
        "received_at": "2017-08-08T06:40:33+00:00",
        "html_content": "Hello,\n\nI upgraded to the newest version this morning.\n\nThanks\nHari",
        "striped_html": "Hello,\n\nI upgraded to the newest version this morning.\n\nThanks\nHari",
        "source_content": "Delivered-To: support@brewfictus.kayako.com\nDate: Wed, 16 Dec 2015 22:00:13 +0000\nSubject: Kayako - Chat on 2015-12-17 02:18:45\nFrom: Hari <hari@gmail.com>\nTo: support@brewfictus.kayako.com\nMIME-Version: 1.0\nContent-Type: multipart/alternative;\n boundary=\"_=_swift_v4_1450303213_8cc9a108eb7008f9afeafed16c9e987b_=_\"\nX-SG-EID: QILBy6GWm4BJit8k8tqyKKnbZzKy3W8FXuMDHZmezhLfBmYKZjxEhQb6ngmql36zAn9opbI8/nqkXH\n JRww2O0IomzG4MflpUDGhxNxRKmIkPEErQVp3D2EilfGlXfRIjngvLFh7SYLPUzXPW1g+THqabUTXk\n jQ1BlX3208xIURPP+UDRL6xbifzyjUeJX262S8VdgMZsGOKtGuw6Jff4GTaUJPpzIvbx0H3ngh3gXL\n o=",
        "resource_type": "email_original"
    },
    "resource": "post"
}
```

## Update a Post

PUT**/api/v1/cases/posts/:id.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| post_status | string |  | Allowed values are `DELIVERED`, `SEEN` When a post is marked as `SEEN`, all preceding posts are also set as `SEEN`. Therefore, to update the _post\_status_ of all visible posts, perform a single request using the last visible post's id. |

### Response

```
{
    "status": 200
}
```

## Reply

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| posts | Resources |  |  |
| case | [Case](https://developer.kayako.com/api/v1/cases/cases/#resource-fields) |  |  |

## Add a reply

POST**/api/v1/cases/:id/reply.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| contents | string |  |  |
| channel | string |  | `MAIL`, `TWITTER`, `FACEBOOK`, `NOTE` |
| channel_id | integer |  | Not required for channel `NOTE` |
| channel_options | string |  | **MAIL:** Allowed options are _cc_ **_cc_:** comma separated email addresses **Example:** `{"cc":"ben.pigford@brewfictus.com,bekki.park@brewfictus.com"}` **TWITTER:** Allowed options is _type_ **_type_:** allowed values are `REPLY`, `DM`, `REPLY_WITH_PROMPT`**Default:**`REPLY` **Note:** for type `REPLY_WITH_PROMPT` please enable [Receive Direct Messages from Anyone](https://business.twitter.com/en/help/campaign-editing-and-optimization/public-to-private-conversation.html) setting for Twitter account **Example:** `{"type":"REPLY_WITH_PROMPT"}` **NOTE:** Allowed option is _html_ **_html_:** if set to true then system will parse the contents through the purify service and render them **Example:** `{"html":true}` |
| subject | string |  | Change the subject of the conversation |
| requester_id | integer |  |  |
| status_id | integer |  |  |
| priority_id | integer |  |  |
| type_id | integer |  |  |
| assigned_team_id | integer |  |  |
| assigned_agent_id | integer |  |  |
| tags | string |  | The comma separated tags |
| form_id | integer |  |  |
| source | string |  | `MAIL`, `MESSENGER`, `AGENT`, `API`, `MOBILE` |
| metadata | array |  | We accept the metadata in key - value pair **Example:** {"user_agent":"Chrome"} **_Note_:** Currently we only support `user_agent`, can be used to set user-friendly names like Chrome, Firefox etc |
| field_values | array |  | This operation will add or update existing field values with requested field keys. **Format:** field_values[field_key] = field_value field_values[field_key] = field_value **For Options:** CSV options are accepted for multi-select **WARNING:** All options must be passed. The options which are not passed will be removed. |
| attachment | [multipart/form-data](https://developer.kayako.com/api/v1/cases/cases/#) |  |  |
| attachment_file_ids | string |  | Comma-separated list of file IDs. Files can be uploaded via the [Add a file endpoint](https://developer.kayako.com/api/v1/general/files/#Add-a-file) |
| client_id | string |  | If provided, this value will be returned in the [Posts](https://developer.kayako.com/api/v1/cases/cases/#Posts) resource. Used to identify messages reflected back from the server. |

### Response

```
{
    "status": 201,
    "data": {
        "posts": [
            {
                "id": 1,
                "resource_type": "post"
            }
        ],
        "case": {
            "id": 1,
            "resource_type": "case"
        },
        "resource_type": "case_reply"
    },
    "resource": "case_reply"
}
```




### Fields

Title: Fields - Cases | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/cases/fields/

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   CORE
4.   CASES

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| fielduuid | string |  | The fielduuid is unique to this field |
| title | string |  |  |
| type | string |  | **System Field Types:**`SUBJECT`, `MESSAGE`, `PRIORITY`, `STATUS`, `TYPE`, `TEAM`, `ASSIGNEE` **Custom Field Types:**`TEXT`, `TEXTAREA`, `CHECKBOX`, `RADIO`, `SELECT`, `DATE`, `FILE`, `NUMERIC`, `DECIMAL`, `YESNO`, `CASCADINGSELECT`, `REGEX`******** |
| key | string |  | The key is unique to this field |
| is_required_for_agents | boolean |  | **Default:**`false` |
| is_required_on_resolution | boolean |  | **Default:**`false` |
| is_visible_to_customers | boolean |  | **Default:**`false` |
| customer_titles | [Field Locales](https://developer.kayako.com/api/v1/general/field_locales/) |  |  |
| is_customer_editable | boolean |  | **Default:**`false` |
| is_required_for_customers | boolean |  | **Default:**`false` |
| descriptions | [Field Locales](https://developer.kayako.com/api/v1/general/field_locales/) |  |  |
| regular_expression | string |  |  |
| sort_order | integer |  |  |
| is_enabled | boolean |  |  |
| is_system | boolean |  |  |
| options | [Options](https://developer.kayako.com/api/v1/cases/fields#Options) |  |  |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve all fields

GET**/api/v1/cases/fields.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)
Ordered by sort_order (ascending)

Collaborators and Agents can only see the enabled fields.

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "fielduuid": "dbc6a83d-5374-42ef-9ccc-c518232ca46d",
            "title": "Serial number",
            "type": "TEXT",
            "key": "serial_number",
            "is_required_for_agents": false,
            "is_required_on_resolution": false,
            "is_visible_to_customers": true,
            "customer_titles": [
                {
                    "id": 1,
                    "resource_type": "locale_field"
                },
                {
                    "id": 2,
                    "resource_type": "locale_field"
                }
            ],
            "is_customer_editable": true,
            "is_required_for_customers": true,
            "descriptions": [],
            "regular_expression": null,
            "sort_order": 9,
            "is_enabled": true,
            "is_system": false,
            "options": [],
            "created_at": "2015-11-03T18:30:38+05:00",
            "updated_at": "2015-11-03T18:30:38+05:00",
            "resource_type": "case_field",
            "resource_url": "https://brewfictus.kayako.com/api/v1/cases/fields/1"
        }
    ],
    "resource": "case_field",
    "total_count": 1
}
```

## Retrieve a field

GET**/api/v1/cases/fields/:id.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

Collaborators and Agents can only see the enabled field.

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "fielduuid": "dbc6a83d-5374-42ef-9ccc-c518232ca46d",
        "title": "Serial number",
        "type": "TEXT",
        "key": "serial_number",
        "is_required_for_agents": false,
        "is_required_on_resolution": false,
        "is_visible_to_customers": true,
        "customer_titles": [
            {
                "id": 1,
                "resource_type": "locale_field"
            },
            {
                "id": 2,
                "resource_type": "locale_field"
            }
        ],
        "is_customer_editable": true,
        "is_required_for_customers": true,
        "descriptions": [],
        "regular_expression": null,
        "sort_order": 9,
        "is_enabled": true,
        "is_system": false,
        "options": [],
        "created_at": "2015-11-03T18:30:38+05:00",
        "updated_at": "2015-11-03T18:30:38+05:00",
        "resource_type": "case_field",
        "resource_url": "https://brewfictus.kayako.com/api/v1/cases/fields/1"
    },
    "resource": "case_field"
}
```

## Add a field

POST**/api/v1/cases/fields.json**

### Information

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string |  | `TEXT`, `TEXTAREA`, `CHECKBOX`, `RADIO`, `SELECT`, `DATE`, `FILE`, `NUMERIC`, `DECIMAL`, `YESNO`, `CASCADINGSELECT`, `REGEX` **Note:** If field type `CHECKBOX`, `RADIO`, `SELECT`, `CASCADINGSELECT`[Add Options](https://developer.kayako.com/api/v1/users/fields#Options) |
| title | string |  |  |
| is_required_for_agents | boolean |  | Required when creating, reply and updating a conversation **Default:**`false` |
| is_required_on_resolution | boolean |  | Required when resolving a conversation **Default:**`false` |
| is_visible_to_customers | boolean |  | **Default:**`false` |
| customer_titles | string |  | Only applicable when "Customers can see this field" is enabled |
| is_customer_editable | boolean |  | Only applicable when "Customers can see this field" is enabled **Default:**`false` |
| is_required_for_customers | boolean |  | Only applicable when "Customers can edit this field" is enabled **Default:**`false` |
| descriptions | string |  | User-defined description of this field's purpose |
| is_enabled | boolean |  | **Default:**`true` |
| regular_expression | string |  | Regular expression field only. The validation pattern for a field value to be deemed valid. |
| options | string |  |  |

### Request

```
curl -X POST https://brewfictus.kayako.com/api/v1/cases/fields \
     -d '{"title":"Your coffee","type":"SELECT","is_required_for_agents":true,"is_required_on_resolution":true,"is_visible_to_customers":true,"customer_titles":[{"locale":"en-us", "translation": "Your coffee"}, {"locale":"fr", "translation": "Ihren Kaffee"}],descriptions":[],"is_customer_editable":true,"is_required_for_customers":true,"regular_expression":null,"is_enabled":true,"options":[{"values":[{"locale":"en-us","translation":"Yirgacheffe Oromia - Single Origin"}, {"locale":"fr","translation":"Yirgacheffe Oromia - Origine unique"}], "tag":"yirgacheffe-oromia", "sort_order":"1"},{"values":[{"locale":"en-us","translation":"Kenya Kiunyu Ab - Single Origin"}, {"locale":"fr","translation":"Kenya Kiunyu Ab - Origine unique"}], "tag":"kenya-kiunyu-ab", "sort_order":"2"}]}' \
     -H "Content-Type: application/json" \
     -u 'jordan.mitchell@brewfictus.com:jmit6#lsXo'
```

### Response

```
{
    "status": 201,
    "data": {
        "id": 1,
        "fielduuid": "dbc6a83d-5374-42ef-9ccc-c518232ca46d",
        "title": "Serial number",
        "type": "TEXT",
        "key": "serial_number",
        "is_required_for_agents": false,
        "is_required_on_resolution": false,
        "is_visible_to_customers": true,
        "customer_titles": [
            {
                "id": 1,
                "resource_type": "locale_field"
            },
            {
                "id": 2,
                "resource_type": "locale_field"
            }
        ],
        "is_customer_editable": true,
        "is_required_for_customers": true,
        "descriptions": [],
        "regular_expression": null,
        "sort_order": 9,
        "is_enabled": true,
        "is_system": false,
        "options": [],
        "created_at": "2015-11-03T18:30:38+05:00",
        "updated_at": "2015-11-03T18:30:38+05:00",
        "resource_type": "case_field",
        "resource_url": "https://brewfictus.kayako.com/api/v1/cases/fields/1"
    },
    "resource": "case_field"
}
```

## Update a field

PUT**/api/v1/cases/fields/:id.json**

### Information

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| title | string |  |  |
| is_required_for_agents | boolean |  |  |
| is_required_on_resolution | boolean |  |  |
| is_visible_to_customers | boolean |  |  |
| customer_titles | string |  |  |
| is_customer_editable | boolean |  |  |
| is_required_for_customers | boolean |  |  |
| descriptions | string |  |  |
| is_enabled | boolean |  |  |
| regular_expression | string |  |  |
| options | string |  |  |

### Request

```
curl -X PUT https://brewfictus.kayako.com/api/v1/cases/fields/:id \
     -d '{"title":"Your coffee","type":"SELECT","is_required_for_agents":true,"is_required_on_resolution":true,"is_visible_to_customers":true,"customer_titles":[{"id":"20",locale":"en-us", "translation": "Your coffee"}, {"id":"21","locale":"fr", "translation": "Ihren Kaffee"}],descriptions":[],"is_customer_editable":true,"is_required_for_customers":true,"regular_expression":null,"is_enabled":true,"options":[{"id":"4","values":[{"id":"22","locale":"en-us","translation":"Yirgacheffe Oromia - Single Origin"}, {"id":"23","locale":"fr","translation":"Yirgacheffe Oromia - Origine unique"}], "tag":"yirgacheffe-oromia", "sort_order":"1"},{"id":"5","values":[{"id":"24","locale":"en-us","translation":"Kenya Kiunyu Ab - Single Origin"}, {"id":"25","locale":"fr","translation":"Kenya Kiunyu Ab - Origine unique"}], "tag":"kenya-kiunyu-ab", "sort_order":"2"}]}' \
     -H "Content-Type: application/json" \
     -u 'jordan.mitchell@brewfictus.com:jmit6#lsXo'
```

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "fielduuid": "dbc6a83d-5374-42ef-9ccc-c518232ca46d",
        "title": "Serial number",
        "type": "TEXT",
        "key": "serial_number",
        "is_required_for_agents": false,
        "is_required_on_resolution": false,
        "is_visible_to_customers": true,
        "customer_titles": [
            {
                "id": 1,
                "resource_type": "locale_field"
            },
            {
                "id": 2,
                "resource_type": "locale_field"
            }
        ],
        "is_customer_editable": true,
        "is_required_for_customers": true,
        "descriptions": [],
        "regular_expression": null,
        "sort_order": 9,
        "is_enabled": true,
        "is_system": false,
        "options": [],
        "created_at": "2015-11-03T18:30:38+05:00",
        "updated_at": "2015-11-03T18:30:38+05:00",
        "resource_type": "case_field",
        "resource_url": "https://brewfictus.kayako.com/api/v1/cases/fields/1"
    },
    "resource": "case_field"
}
```

## Reorder fields

PUT**/api/v1/cases/fields/reorder.json**

### Information

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| field_ids | string |  | Pass the fields in order you want to set |

### Response

```
{
    "status": 200,
    "total_count": 3
}
```

## Delete a field

DELETE**/api/v1/cases/fields/:id.json**

### Information

### Response

```
{
    "status": 200
}
```

## Delete fields

DELETE**/api/v1/cases/fields.json**

### Information

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```

## Options

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| fielduuid | string |  |  |
| values | [Field Locales](https://developer.kayako.com/api/v1/general/field_locales/) |  |  |
| sort_order | integer |  | Ordering of the option relative to other options |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Reorder options

PUT**/api/v1/cases/fields/:id/options/reorder.json**

### Information

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| option_ids | string |  | Pass the options in order you want to set |

### Response

```
{
    "status": 200,
    "total_count": 3
}
```

## Delete a option

DELETE**/api/v1/cases/fields/:id/options/:id.json**

### Information

### Response

```
{
    "status": 200
}
```

## Delete options

DELETE**/api/v1/cases/fields/:id/options.json**

### Information

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```

## Values

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| field | [Field](https://developer.kayako.com/api/v1/cases/fields) |  |  |
| value | string |  |  |

## Retrieve values

GET**/api/v1/cases/:id/field/values.json**

### Information

### Response

```
{
    "status": 200,
    "data": [
        {
            "field": {
                "id": 1,
                "resource_type": "case_field"
            },
            "value": "3",
            "resource_type": "case_field_value"
        }
    ],
    "resource": "case_field_value",
    "total_count": 1
}
```




### Forms

Title: Forms - Cases | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/cases/forms/

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   CORE
4.   CASES

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| title | string |  |  |
| is_visible_to_customers | boolean |  | Is the form visible to the end user **Default:**`false` |
| customer_title | string |  |  |
| customer_titles | [Field Locales](https://developer.kayako.com/api/v1/general/field_locales/) |  |  |
| description | string |  |  |
| descriptions | [Field Locales](https://developer.kayako.com/api/v1/general/field_locales/) |  |  |
| is_enabled | boolean |  | **Default:**`true` |
| is_default | boolean |  | **Default:**`false` |
| is_deleted | boolean |  |  |
| sort_order | integer |  | Ordering of the field relative to other fields |
| fields | [Fields](https://developer.kayako.com/api/v1/cases/fields/) |  |  |
| brand | [Brands](https://developer.kayako.com/api/v1/general/brands/) |  |  |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve all forms

GET**/api/v1/cases/forms.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[configuration](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)
Ordered by sort_order (ascending)

Collaborators and Agents can see the enabled forms.

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "title": "Maintenance job form",
            "is_visible_to_customers": true,
            "customer_title": "Maintenance job form",
            "customer_titles": [
                {
                    "id": 1,
                    "resource_type": "locale_field"
                },
                {
                    "id": 2,
                    "resource_type": "locale_field"
                }
            ],
            "description": null,
            "descriptions": [
                {
                    "id": 1,
                    "resource_type": "locale_field"
                },
                {
                    "id": 2,
                    "resource_type": "locale_field"
                }
            ],
            "is_enabled": true,
            "is_default": false,
            "is_deleted": false,
            "sort_order": 1,
            "fields": [
                {
                    "id": 1,
                    "resource_type": "case_field"
                }
            ],
            "brand": {
                "id": 1,
                "resource_type": "brand"
            },
            "created_at": "2015-07-31T13:28:05+05:00",
            "updated_at": "2015-07-31T13:28:05+05:00",
            "resource_type": "case_form",
            "resource_url": "https://brewfictus.kayako.com/api/v1/cases/forms/1"
        }
    ],
    "resource": "case_form",
    "total_count": 1
}
```

## Retrieve a form

GET**/api/v1/cases/forms/:id.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[configuration](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

Collaborators and Agents can see the enabled fields.

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "title": "Maintenance job form",
        "is_visible_to_customers": true,
        "customer_title": "Maintenance job form",
        "customer_titles": [
            {
                "id": 1,
                "resource_type": "locale_field"
            },
            {
                "id": 2,
                "resource_type": "locale_field"
            }
        ],
        "description": null,
        "descriptions": [
            {
                "id": 1,
                "resource_type": "locale_field"
            },
            {
                "id": 2,
                "resource_type": "locale_field"
            }
        ],
        "is_enabled": true,
        "is_default": false,
        "is_deleted": false,
        "sort_order": 1,
        "fields": [
            {
                "id": 1,
                "resource_type": "case_field"
            }
        ],
        "brand": {
            "id": 1,
            "resource_type": "brand"
        },
        "created_at": "2015-07-31T13:28:05+05:00",
        "updated_at": "2015-07-31T13:28:05+05:00",
        "resource_type": "case_form",
        "resource_url": "https://brewfictus.kayako.com/api/v1/cases/forms/1"
    },
    "resource": "case_form"
}
```

## Add a form

POST**/api/v1/cases/forms.json**

### Information

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| title | string |  |  |
| case_field_ids | string |  |  |
| is_visible_to_customers | boolean |  | Is the form visible to the end user **Default:**`false` |
| customer_titles | string |  | Only applicable when "Customers can see this form" is enabled |
| descriptions | string |  | User-defined description |
| brand_id | integer |  |  |

### Response

```
{
    "status": 201,
    "data": {
        "id": 1,
        "title": "Maintenance job form",
        "is_visible_to_customers": true,
        "customer_title": "Maintenance job form",
        "customer_titles": [
            {
                "id": 1,
                "resource_type": "locale_field"
            },
            {
                "id": 2,
                "resource_type": "locale_field"
            }
        ],
        "description": null,
        "descriptions": [
            {
                "id": 1,
                "resource_type": "locale_field"
            },
            {
                "id": 2,
                "resource_type": "locale_field"
            }
        ],
        "is_enabled": true,
        "is_default": false,
        "is_deleted": false,
        "sort_order": 1,
        "fields": [
            {
                "id": 1,
                "resource_type": "case_field"
            }
        ],
        "brand": {
            "id": 1,
            "resource_type": "brand"
        },
        "created_at": "2015-07-31T13:28:05+05:00",
        "updated_at": "2015-07-31T13:28:05+05:00",
        "resource_type": "case_form",
        "resource_url": "https://brewfictus.kayako.com/api/v1/cases/forms/1"
    },
    "resource": "case_form"
}
```

## Update a form

PUT**/api/v1/cases/forms/:id.json**

### Information

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| title | string |  |  |
| is_visible_to_customers | boolean |  |  |
| customer_titles | string |  | Only applicable when "Customers can see this field" is enabled |
| descriptions | string |  | User-defined description |
| is_enabled | boolean |  |  |
| case_field_ids | string |  | **Warning:** All conversation field ids must be passed on update except system field ids. ids that are not passed will be removed |
| brand_id | integer |  | If pass null or empty, then linking of brand with this form will get remove. |

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "title": "Maintenance job form",
        "is_visible_to_customers": true,
        "customer_title": "Maintenance job form",
        "customer_titles": [
            {
                "id": 1,
                "resource_type": "locale_field"
            },
            {
                "id": 2,
                "resource_type": "locale_field"
            }
        ],
        "description": null,
        "descriptions": [
            {
                "id": 1,
                "resource_type": "locale_field"
            },
            {
                "id": 2,
                "resource_type": "locale_field"
            }
        ],
        "is_enabled": true,
        "is_default": false,
        "is_deleted": false,
        "sort_order": 1,
        "fields": [
            {
                "id": 1,
                "resource_type": "case_field"
            }
        ],
        "brand": {
            "id": 1,
            "resource_type": "brand"
        },
        "created_at": "2015-07-31T13:28:05+05:00",
        "updated_at": "2015-07-31T13:28:05+05:00",
        "resource_type": "case_form",
        "resource_url": "https://brewfictus.kayako.com/api/v1/cases/forms/1"
    },
    "resource": "case_form"
}
```

## Mark as default

PUT**/api/v1/cases/forms/default.json**

### Information

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| form_id | integer |  |  |

### Response

```
{
    "status": 200
}
```

## Update forms

PUT**/api/v1/cases/forms.json**

### Information

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| is_enabled | boolean |  |  |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```

## Reorder forms

PUT**/api/v1/cases/forms/reorder.json**

### Information

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| form_ids | string |  | Pass the forms in order you want to set |

### Response

```
{
    "status": 200,
    "total_count": 3
}
```

## Delete a form

DELETE**/api/v1/cases/forms/:id.json**

### Information

### Response

```
{
    "status": 200
}
```

## Delete forms

DELETE**/api/v1/cases/forms.json**

### Information

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```




### Macros

Title: Macros - Cases | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/cases/macros/

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   CORE
4.   CASES

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| title | string |  |  |
| reply_type | string |  | `REPLY`, `NOTE` |
| reply_contents | string |  |  |
| agent | [User](https://developer.kayako.com/api/v1/users/users/) |  | The agent who created/last-modified the macro |
| assignee | [Assignee](https://developer.kayako.com/api/v1/cases/macros#assignee) |  |  |
| type | [Type](https://developer.kayako.com/api/v1/cases/types/) |  |  |
| status | [Status](https://developer.kayako.com/api/v1/cases/statuses/) |  |  |
| priority_action | string |  | `INCREASE_ONE_LEVEL`, `DECREASE_ONE_LEVEL` |
| priority | [Priority](https://developer.kayako.com/api/v1/cases/priorities/) |  |  |
| visibility | [Visibility](https://developer.kayako.com/api/v1/cases/macros#visibility) |  |  |
| add_tags | array |  |  |
| remove_tags | array |  |  |
| usage_count | integer |  |  |
| last_used_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Assignee

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| type | string |  | `UNASSIGNED`, `CURRENT_AGENT`, `TEAM`, `AGENT` |
| team | [Team](https://developer.kayako.com/api/v1/users/teams/) |  |  |
| agent | [User](https://developer.kayako.com/api/v1/users/users/) |  |  |

## Visibility

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| type | string |  | `ALL`, `TEAM`, `PRIVATE` |
| team | [Team](https://developer.kayako.com/api/v1/users/teams/) |  |  |

## Retrieve all macros

GET**/api/v1/cases/macros.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)
Ordered by title (ascending)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| show_all | boolean |  | Only applicable for ADMINS or OWNERS |

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "title": "What is Chemex?",
            "reply_type": "REPLY",
            "reply_contents": "The Chemex brews coffee using the infusion method, which makes it most similar to drip coffee in terms of body and taste.",
            "agent": {
                "id": 1,
                "resource_type": "user"
            },
            "assignee": {
                "type": null,
                "team": null,
                "agent": null,
                "resource_type": "macro_assignee"
            },
            "type": null,
            "status": null,
            "priority_action": null,
            "priority": null,
            "visibility": {
                "type": "ALL",
                "team": null,
                "resource_type": "macro_visibility"
            },
            "add_tags": [
                "chemex"
            ],
            "remove_tags": [
                "general"
            ],
            "usage_count": 0,
            "last_used_at": null,
            "created_at": "2015-08-03T10:17:14+05:00",
            "updated_at": "2015-08-03T10:17:14+05:00",
            "resource_type": "macro",
            "resource_url": "https://brewfictus.kayako.com/api/v1/cases/macros/1"
        }
    ],
    "resource": "macro",
    "total_count": 1
}
```

## Retrieve a macro

GET**/api/v1/cases/macros/:id.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "title": "What is Chemex?",
        "reply_type": "REPLY",
        "reply_contents": "The Chemex brews coffee using the infusion method, which makes it most similar to drip coffee in terms of body and taste.",
        "agent": {
            "id": 1,
            "resource_type": "user"
        },
        "assignee": {
            "type": null,
            "team": null,
            "agent": null,
            "resource_type": "macro_assignee"
        },
        "type": null,
        "status": null,
        "priority_action": null,
        "priority": null,
        "visibility": {
            "type": "ALL",
            "team": null,
            "resource_type": "macro_visibility"
        },
        "add_tags": [
            "chemex"
        ],
        "remove_tags": [
            "general"
        ],
        "usage_count": 0,
        "last_used_at": null,
        "created_at": "2015-08-03T10:17:14+05:00",
        "updated_at": "2015-08-03T10:17:14+05:00",
        "resource_type": "macro",
        "resource_url": "https://brewfictus.kayako.com/api/v1/cases/macros/1"
    },
    "resource": "macro"
}
```

## Add a macro

POST**/api/v1/cases/macros.json**

### Information

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| title | string |  |  |
| visibility_type | string |  | `ALL`, `TEAM`, `PRIVATE` |
| visible_to_team_id | integer |  |  |
| reply_type | string |  | `REPLY`, `NOTE` |
| reply_contents | string |  |  |
| assignee_type | string |  | `UNASSIGNED`, `CURRENT_AGENT`, `TEAM`, `AGENT` |
| assigned_team_id | integer |  | Only applicable when "assignee_type" is set to TEAM or AGENT |
| assigned_agent_id | integer |  | Only applicable when "assignee_type" is set to AGENT |
| type_id | integer |  |  |
| status_id | integer |  |  |
| priority_action | string |  | `INCREASE_ONE_LEVEL`, `DECREASE_ONE_LEVEL` |
| priority_id | integer |  | Either `priority_action` or `priority_id` can be specified, not both |
| add_tags | string |  | Comma separated tags |
| remove_tags | string |  | Comma separated tags |

Macro requires at-least one action in order to be created

### Response

```
{
    "status": 201,
    "data": {
        "id": 1,
        "title": "What is Chemex?",
        "reply_type": "REPLY",
        "reply_contents": "The Chemex brews coffee using the infusion method, which makes it most similar to drip coffee in terms of body and taste.",
        "agent": {
            "id": 1,
            "resource_type": "user"
        },
        "assignee": {
            "type": null,
            "team": null,
            "agent": null,
            "resource_type": "macro_assignee"
        },
        "type": null,
        "status": null,
        "priority_action": null,
        "priority": null,
        "visibility": {
            "type": "ALL",
            "team": null,
            "resource_type": "macro_visibility"
        },
        "add_tags": [
            "chemex"
        ],
        "remove_tags": [
            "general"
        ],
        "usage_count": 0,
        "last_used_at": null,
        "created_at": "2015-08-03T10:17:14+05:00",
        "updated_at": "2015-08-03T10:17:14+05:00",
        "resource_type": "macro",
        "resource_url": "https://brewfictus.kayako.com/api/v1/cases/macros/1"
    },
    "resource": "macro"
}
```

## Update a macro

PUT**/api/v1/cases/macros/:id.json**

### Information

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| title | string |  |  |
| visibility_type | string |  | `ALL`, `TEAM`, `PRIVATE` |
| visible_to_team_id | integer |  | Only applicable when `visibility_type` is set to `TEAM` |
| reply_type | string |  | `REPLY`, `NOTE` |
| reply_contents | string |  |  |
| assignee_type | string |  | `UNASSIGNED`, `CURRENT_AGENT`, `TEAM`, `AGENT` |
| assigned_team_id | integer |  | Only applicable when "assignee_type" is set to TEAM or AGENT |
| assigned_agent_id | integer |  | Only applicable when "assignee_type" is set to AGENT |
| type_id | integer |  |  |
| status_id | integer |  |  |
| priority_action | string |  | `INCREASE_ONE_LEVEL`, `DECREASE_ONE_LEVEL` |
| priority_id | integer |  | Either `priority_action` or `priority_id` can be specified, not both |
| add_tags | string |  | Comma separated tags (This will replace all existing tags with given ones) |
| remove_tags | string |  | Comma separated tags (This will replace all existing tags with given ones) |

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "title": "What is Chemex?",
        "reply_type": "REPLY",
        "reply_contents": "The Chemex brews coffee using the infusion method, which makes it most similar to drip coffee in terms of body and taste.",
        "agent": {
            "id": 1,
            "resource_type": "user"
        },
        "assignee": {
            "type": null,
            "team": null,
            "agent": null,
            "resource_type": "macro_assignee"
        },
        "type": null,
        "status": null,
        "priority_action": null,
        "priority": null,
        "visibility": {
            "type": "ALL",
            "team": null,
            "resource_type": "macro_visibility"
        },
        "add_tags": [
            "chemex"
        ],
        "remove_tags": [
            "general"
        ],
        "usage_count": 0,
        "last_used_at": null,
        "created_at": "2015-08-03T10:17:14+05:00",
        "updated_at": "2015-08-03T10:17:14+05:00",
        "resource_type": "macro",
        "resource_url": "https://brewfictus.kayako.com/api/v1/cases/macros/1"
    },
    "resource": "macro"
}
```

## Mark as used

PUT**/api/v1/cases/macros/:id/used.json**

### Information

### Response

```
{
    "status": 200
}
```

## Delete a macro

DELETE**/api/v1/cases/macro/:id.json**

### Information

Macro deletion is subject to visibility restrictions

### Response

```
{
    "status": 200
}
```

## Delete macros

DELETE**/api/v1/cases/macros.json**

### Information

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

Macro deletion is subject to visibility restrictions

### Response

```
{
    "status": 200,
    "total_count": 2
}
```




### Merge

Title: Merge - Cases | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/cases/merge/

Markdown Content:
```
{
    "status": 201,
    "data": {
        "id": 1,
        "legacy_id": "YAK-923-46434",
        "subject": "Atmosphere Coffee, Inc annual maintenance",
        "portal": "API",
        "source_channel": {
            "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
            "resource_type": "channel"
        },
        "last_public_channel": {
            "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
            "resource_type": "channel"
        },
        "requester": {
            "id": 2,
            "resource_type": "user"
        },
        "creator": {
            "id": 1,
            "resource_type": "user"
        },
        "identity": {
            "id": 1,
            "resource_type": "identity_email"
        },
        "assigned_agent": {
            "id": 1,
            "resource_type": "user"
        },
        "assigned_team": {
            "id": 1,
            "legacy_id": null,
            "resource_type": "team"
        },
        "last_assigned_by": {
            "id": 1,
            "resource_type": "user"
        },
        "brand": {
            "id": 1,
            "resource_type": "brand"
        },
        "status": {
            "id": 1,
            "resource_type": "case_status"
        },
        "priority": {
            "id": 3,
            "resource_type": "case_priority"
        },
        "type": {
            "id": 1,
            "resource_type": "case_type"
        },
        "read_marker": {
            "id": 1,
            "resource_type": "read_marker"
        },
        "sla_version": {
            "id": 1,
            "resource_type": "sla_version"
        },
        "sla_metrics": [
            {
                "id": 1,
                "resource_type": "sla_metric"
            },
            {
                "id": 2,
                "resource_type": "sla_metric"
            },
            {
                "id": 3,
                "resource_type": "sla_metric"
            }
        ],
        "form": {
            "id": 1,
            "resource_type": "case_form"
        },
        "custom_fields": [
            {
                "field": {
                    "id": 1,
                    "resource_type": "case_field"
                },
                "value": "3",
                "resource_type": "case_field_value"
            }
        ],
        "last_replier": {
            "id": 1,
            "resource_type": "user"
        },
        "last_replier_identity": {
            "id": 1,
            "resource_type": "identity_email"
        },
        "last_completed_by": null,
        "last_updated_by": null,
        "last_closed_by": null,
        "state": "ACTIVE",
        "post_count": 2,
        "has_notes": false,
        "pinned_notes_count": 0,
        "has_attachments": false,
        "is_merged": false,
        "rating": null,
        "rating_status": "UNOFFERED",
        "last_post_status": "SEEN",
        "last_post_preview": "My HubID is 525862. I'm trying to send a notification email to my salespeople when a contact is assigned to them. All of my other salespeople are receiving the emails fine, but for one person they never arrived. We checked in their SPAM folder, but the...",
        "last_post_type": "PUBLIC",
        "last_message_preview": "My HubID is 525862. I'm trying to send a notification email to my salespeople when a contact is assigned to them. All of my other salespeople are receiving the emails fine, but for one person they never arrived. We checked in their SPAM folder, but the...",
        "realtime_channel": "presence-d6c6a8b31be92885222ee53dde6c99c745c5f4cf77f1bd9dd3519d07fa730c71@v1_cases_1",
        "last_assigned_at": "2015-07-30T06:45:25+05:00",
        "last_replied_at": "2015-07-27T11:35:09+05:00",
        "last_opened_at": null,
        "last_pending_at": null,
        "last_closed_at": null,
        "last_completed_at": null,
        "last_agent_activity_at": null,
        "last_customer_activity_at": "2015-07-30T06:45:25+05:00",
        "last_reply_by_agent_at": null,
        "last_reply_by_requester_at": null,
        "agent_updated_at": null,
        "latest_assignee_update": null,
        "created_at": "2015-07-30T06:45:25+05:00",
        "updated_at": "2015-07-30T06:45:25+05:00",
        "resource_type": "case",
        "resource_url": "https://brewfictus.kayako.com/api/v1/cases/1"
    },
    "resource": "case"
}
```




### Metrics

Title: Metrics - Cases | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/cases/metrics/

Markdown Content:
# Metrics - Cases | Kayako Developers

[![Image 1](https://developer.kayako.com/img/kayako-logo.png)](https://developer.kayako.com/)

*     
*   [Docs](https://developer.kayako.com/docs/single_sign_on/introduction/)
*   [API](https://developer.kayako.com/api/v1/reference/introduction/)
*   [SDK](https://developer.kayako.com/sdk/java/integration_guide/)
*   [Messenger![Image 2: beta](https://developer.kayako.com/img/new.png)](https://developer.kayako.com/messenger/home/)

*     
*   [Docs](https://developer.kayako.com/docs/single_sign_on/introduction/)
*   [API](https://developer.kayako.com/api/v1/reference/introduction/)
*   [SDK](https://developer.kayako.com/sdk/java/integration_guide/)
*   [Messenger![Image 3: beta](https://developer.kayako.com/img/new.png)](https://developer.kayako.com/messenger/home/)

Cases

*   [Reference](https://developer.kayako.com/api/v1/reference/introduction/)
Core*   [Users](https://developer.kayako.com/api/v1/users/activities/)
*   [Cases](https://developer.kayako.com/api/v1/cases/activities/)
*   [Insights](https://developer.kayako.com/api/v1/insights/cases/)
*   [Search](https://developer.kayako.com/api/v1/search/search/)
*   [Automation](https://developer.kayako.com/api/v1/automation/endpoints/)
Channels*   [Twitter](https://developer.kayako.com/api/v1/twitter/accounts/)
*   [Facebook](https://developer.kayako.com/api/v1/facebook/accounts/)
*   [Mail](https://developer.kayako.com/api/v1/mail/mailboxes/)
*   [Event](https://developer.kayako.com/api/v1/event/events/)
*   [Help Center](https://developer.kayako.com/api/v1/help_center/articles/)
Others*   [General](https://developer.kayako.com/api/v1/general/autocomplete/)

*   [Activities](https://developer.kayako.com/api/v1/cases/activities/)
*   [Cases](https://developer.kayako.com/api/v1/cases/cases/)
*   [Fields](https://developer.kayako.com/api/v1/cases/fields/)
*   [Forms](https://developer.kayako.com/api/v1/cases/forms/)
*   [Macros](https://developer.kayako.com/api/v1/cases/macros/)
*   [Merge](https://developer.kayako.com/api/v1/cases/merge/)
*   [Metrics](https://developer.kayako.com/api/v1/cases/metrics/)
    *   [Conversations](https://developer.kayako.com/api/v1/cases/metrics/#Conversations)
        *   [Retrieve conversation metrics](https://developer.kayako.com/api/v1/cases/metrics/#Metrics__Retrieve-conversation-metrics)

*   [Notes](https://developer.kayako.com/api/v1/cases/notes/)
*   [Priorities](https://developer.kayako.com/api/v1/cases/priorities/)
*   [Satisfaction Ratings](https://developer.kayako.com/api/v1/cases/satisfaction_ratings/)
*   [Service Level Agreements](https://developer.kayako.com/api/v1/cases/service_level_agreements/)
*   [Statuses](https://developer.kayako.com/api/v1/cases/statuses/)
*   [Tags](https://developer.kayako.com/api/v1/cases/tags/)
*   [Timetracking](https://developer.kayako.com/api/v1/cases/timetracking/)
*   [Types](https://developer.kayako.com/api/v1/cases/types/)
*   [Views](https://developer.kayako.com/api/v1/cases/views/)

1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   CORE
4.   CASES

# Metrics

## Metadata

Version 1.0
Last Updated January 13, 2017

## Actions

## Conversations

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| is_first_contact_resolved | boolean |  |  |
| was_reopened | boolean |  |  |
| last_reopened_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| first_assignment_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| last_assignment_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| last_activity_by_requester_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| last_activity_by_assignee_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| last_reply_by_agent_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| last_reply_by_assignee_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| last_reply_by_requester_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| last_reply_by_customer_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| agent_updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| customer_updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| requester_updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| team_updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| priority_updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| type_updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| status_update_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| reopen_count | integer |  |  |
| resolution_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| agents_to_resolution | integer |  |  |
| replies_to_resolution | integer |  |  |
| last_replier | [User](https://developer.kayako.com/api/v1/users/users/) |  |  |
| resolved_by | [User](https://developer.kayako.com/api/v1/users/users/) |  |  |
| resolution_calendar_time | integer |  |  |
| resolution_business_time | integer |  |  |
| average_calendar_response_time | integer |  |  |
| average_business_response_time | integer |  |  |
| agent_first_calendar_response_time | integer |  |  |
| agent_first_business_response_time | integer |  |  |
| agent_calendar_wait_time | integer |  |  |
| agent_business_wait_time | integer |  |  |
| customer_calendar_wait_time | integer |  |  |
| customer_business_wait_time | integer |  |  |
| priority_change_count | integer |  |  |
| sla_change_count | integer |  |  |
| agent_reply_count | integer |  |  |
| requester_reply_count | integer |  |  |
| assignee_change_count | integer |  |  |
| team_change_count | integer |  |  |
| agent_touch_count | integer |  |  |

## Retrieve conversation metrics

GET**/api/v1/cases/:id/metrics.json**

### Information

Allowed for Agents, Admins & Owners
Scope[conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Response

```text
{
    "status": 200,
    "data": {
        "is_first_contact_resolved": false,
        "was_reopened": false,
        "last_reopen_at": null,
        "first_assignment_at": null,
        "last_assignment_at": "1970-01-01T00:00:00+05:00",
        "last_activity_by_requester_at": null,
        "last_activity_by_assignee_at": "2016-03-10T12:34:24+05:00",
        "last_reply_by_agent_at": "2016-03-10T12:34:24+05:00",
        "last_reply_by_assignee_at": "2016-03-10T12:34:24+05:00",
        "last_reply_by_requester_at": null,
        "last_reply_by_customer_at": null,
        "agent_update_at": "2016-03-10T12:34:24+05:00",
        "customer_updated_at": null,
        "requester_updated_at": null,
        "team_updated_at": null,
        "priority_updated_at": null,
        "type_updated_at": null,
        "status_update_at": "2016-03-10T12:34:24+05:00",
        "reopen_count": 0,
        "resolution_at": null,
        "agents_to_resolution": 0,
        "replies_to_resolution": 0,
        "last_replier": {
            "id": 1,
            "resource_type": "user"
        },
        "resolved_by": null,
        "resolution_calendar_time": 0,
        "resolution_business_time": 0,
        "average_calendar_response_time": 0,
        "average_business_response_time": 0,
        "agent_first_calendar_response_time": 402,
        "agent_first_business_response_time": 0,
        "agent_calendar_wait_time": 0,
        "agent_business_wait_time": 0,
        "customer_calendar_wait_time": 0,
        "customer_business_wait_time": 0,
        "priority_change_count": 0,
        "sla_change_count": 0,
        "agent_reply_count": 1,
        "requester_reply_count": 0,
        "assignee_change_count": 0,
        "team_change_count": 0,
        "agent_touch_count": 1,
        "resource_type": "case_metric"
    },
    "resource": "case_metric"
}
```

 Copyright © 2018 [Kayako](http://www.kayako.com/). All rights reserved • [Privacy Policy](http://www.kayako.com/about/privacy)

[](https://www.facebook.com/kayako/)[](https://twitter.com/kayako)




### Notes

Title: Notes - Cases | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/cases/notes/

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   CORE
4.   CASES

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| body_text | string |  |  |
| body_html | string |  |  |
| is_pinned | boolean |  | **Default:**`false` |
| pinned_by | [User](https://developer.kayako.com/api/v1/users/users/) |  |  |
| user | [User](https://developer.kayako.com/api/v1/users/users/) |  |  |
| attachments | [Attachments](https://developer.kayako.com/api/v1/cases/notes/#attachments) |  |  |
| download_all | string |  |  |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Attachments

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| size | integer |  |  |
| width | integer |  | Only if the attachment is image |
| height | integer |  | Only if the attachment is image |
| type | string |  | Mime-type of the file |
| content_id | string |  | Content ID used for inline attachment |
| alt | string |  |  |
| url | string |  | The URL to view the attachment |
| url_download | string |  | The URL to download the attachment |
| thumbnails | [Thumbnails](https://developer.kayako.com/api/v1/cases/notes/#thumbnails) |  |  |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Thumbnails

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| size | integer |  |  |
| width | integer |  |  |
| height | integer |  |  |
| type | string |  | Mime-type of the file |
| url | string |  | The URL to view the thumbnail |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve all notes

GET**/api/v1/cases/:id/notes.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)
Ordered by created_at (descending)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| is_pinned | boolean |  |  |
| filter | string |  |  |

This end-point will list the notes which are on conversation, it's requester and requester's organization.

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "body_text": "Customer is using Honey - Blend. So communicate accordingly",
            "body_html": null,
            "is_pinned": true,
            "pinned_by": {
                "id": 1,
                "resource_type": "user"
            },
            "user": {
                "id": 1,
                "resource_type": "user"
            },
            "attachments": [],
            "download_all": null,
            "created_at": "2016-02-17T08:20:18+05:00",
            "updated_at": "2016-02-17T08:20:18+05:00",
            "resource_type": "note",
            "resource_url": "https://brewfictus.kayako.com/api/v1/cases/1/notes/1"
        }
    ],
    "resource": "note",
    "offset": 0,
    "limit": 10,
    "total_count": 3
}
```

## Retrieve a note

GET**/api/v1/cases/:id/notes/:id.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "body_text": "Customer is using Honey - Blend. So communicate accordingly",
        "body_html": null,
        "is_pinned": true,
        "pinned_by": {
            "id": 1,
            "resource_type": "user"
        },
        "user": {
            "id": 1,
            "resource_type": "user"
        },
        "attachments": [],
        "download_all": null,
        "created_at": "2016-02-17T08:20:18+05:00",
        "updated_at": "2016-02-17T08:20:18+05:00",
        "resource_type": "note",
        "resource_url": "https://brewfictus.kayako.com/api/v1/cases/1/notes/1"
    },
    "resource": "note"
}
```

## Update a note

PUT**/api/v1/cases/:id/notes/:id.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| is_pinned | boolean |  | If set to true then it wil appear as a pinned in the conversation timelines. |

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "body_text": "Customer is using Honey - Blend. So communicate accordingly",
        "body_html": null,
        "is_pinned": true,
        "pinned_by": {
            "id": 1,
            "resource_type": "user"
        },
        "user": {
            "id": 1,
            "resource_type": "user"
        },
        "attachments": [],
        "download_all": null,
        "created_at": "2016-02-17T08:20:18+05:00",
        "updated_at": "2016-02-17T08:20:18+05:00",
        "resource_type": "note",
        "resource_url": "https://brewfictus.kayako.com/api/v1/cases/1/notes/1"
    },
    "resource": "note"
}
```




### Priorities

Title: Priorities - Cases | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/cases/priorities/

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   CORE
4.   CASES

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| label | string |  |  |
| level | integer |  |  |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve all priorities

GET**/api/v1/cases/priorities.json**

### Information

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 3,
            "label": "High",
            "level": 3,
            "created_at": "2015-07-30T06:45:25+05:00",
            "updated_at": "2015-07-30T06:45:25+05:00",
            "resource_type": "case_priority",
            "resource_url": "https://brewfictus.kayako.com/api/v1/cases/priorities/3"
        }
    ],
    "resource": "case_priority",
    "total_count": 1
}
```

## Retrieve a priority

GET**/api/v1/cases/priorities/:id.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Response

```
{
    "status": 200,
    "data": {
        "id": 3,
        "label": "High",
        "level": 3,
        "created_at": "2015-07-30T06:45:25+05:00",
        "updated_at": "2015-07-30T06:45:25+05:00",
        "resource_type": "case_priority",
        "resource_url": "https://brewfictus.kayako.com/api/v1/cases/priorities/3"
    },
    "resource": "case_priority"
}
```

## Add a priority

POST**/api/v1/cases/priorities.json**

### Information

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| label | string |  |  |
| level | integer |  |  |

### Response

```
{
    "status": 201,
    "data": {
        "id": 3,
        "label": "High",
        "level": 3,
        "created_at": "2015-07-30T06:45:25+05:00",
        "updated_at": "2015-07-30T06:45:25+05:00",
        "resource_type": "case_priority",
        "resource_url": "https://brewfictus.kayako.com/api/v1/cases/priorities/3"
    },
    "resource": "case_priority"
}
```

## Update a priority

PUT**/api/v1/cases/priorities/:id.json**

### Information

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| label | string |  |  |
| level | integer |  |  |

### Response

```
{
    "status": 200,
    "data": {
        "id": 3,
        "label": "High",
        "level": 3,
        "created_at": "2015-07-30T06:45:25+05:00",
        "updated_at": "2015-07-30T06:45:25+05:00",
        "resource_type": "case_priority",
        "resource_url": "https://brewfictus.kayako.com/api/v1/cases/priorities/3"
    },
    "resource": "case_priority"
}
```

## Reorder priorities

PUT**/api/v1/cases/priorities/reorder.json**

### Information

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| priority_ids | string |  | Pass the priorities in order you want to set |

### Response

```
{
    "status": 200
}
```

## Delete a priority

DELETE**/api/v1/cases/priorities/:id.json**

### Information

_Note:_ Deleting a priority will remove priority from conversations, macros

### Response

```
{
    "status": 200
}
```

## Delete priorities

DELETE**/api/v1/cases/priorities.json**

### Information

_Note:_ Deleting a priority will remove priority from conversations, macros

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```




### Satisfaction Ratings

Title: Satisfaction Ratings - Cases | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/cases/satisfaction_ratings/

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   CORE
4.   CASES

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| score | string |  | `GOOD`, `BAD` |
| comment | string |  |  |
| case | [Conversation](https://developer.kayako.com/api/v1/cases/cases) |  |  |
| creator | [User](https://developer.kayako.com/api/v1/users/users/) |  |  |
| assignee_person | [User](https://developer.kayako.com/api/v1/users/users/) |  |  |
| assignee_team | [Team](https://developer.kayako.com/api/v1/users/teams/) |  |  |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve all ratings

GET**/api/v1/cases/:id/ratings.json**

### Information

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| score | string |  | `GOOD`, `BAD` |
| comment | string |  | `true`, `false``true` returns result which contains comments`false` returns result without comment |

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "score": "GOOD",
            "comment": null,
            "case": {
                "id": 1,
                "resource_type": "case"
            },
            "creator": {
                "id": 2,
                "resource_type": "user_minimal"
            },
            "assignee_agent": {
                "id": 1,
                "resource_type": "user_minimal"
            },
            "assignee_team": {
                "id": 1,
                "legacy_id": null,
                "resource_type": "team"
            },
            "created_at": "2015-07-28T06:15:24+05:00",
            "updated_at": "2015-07-28T06:15:24+05:00",
            "resource_type": "rating",
            "resource_url": "https://brewfictus.kayako.com/api/v1/cases/ratings/1"
        }
    ],
    "resource": "rating",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Retrieve recent ratings

GET**/api/v1/cases/ratings/recent.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

It's mandatory to pass the source id, i.e. either _user\_id_ or _organization\_id_ or _case\_id_. Only one id is accepted per request.

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| user_id | integer |  |  |
| organization_id | integer |  |  |
| case_id | integer |  |  |
| limit | string |  | Number of recent ratings to fetch **Default:** 3 |

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "score": "GOOD",
            "comment": null,
            "case": {
                "id": 1,
                "resource_type": "case"
            },
            "creator": {
                "id": 2,
                "resource_type": "user_minimal"
            },
            "assignee_agent": {
                "id": 1,
                "resource_type": "user_minimal"
            },
            "assignee_team": {
                "id": 1,
                "legacy_id": null,
                "resource_type": "team"
            },
            "created_at": "2015-07-28T06:15:24+05:00",
            "updated_at": "2015-07-28T06:15:24+05:00",
            "resource_type": "rating",
            "resource_url": "https://brewfictus.kayako.com/api/v1/cases/ratings/1"
        }
    ],
    "resource": "rating",
    "total_count": 1
}
```

## Retrieve a rating

GET**/api/v1/cases/:id/ratings/:id.json**

### Information

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "score": "GOOD",
        "comment": null,
        "case": {
            "id": 1,
            "resource_type": "case"
        },
        "creator": {
            "id": 2,
            "resource_type": "user_minimal"
        },
        "assignee_agent": {
            "id": 1,
            "resource_type": "user_minimal"
        },
        "assignee_team": {
            "id": 1,
            "legacy_id": null,
            "resource_type": "team"
        },
        "created_at": "2015-07-28T06:15:24+05:00",
        "updated_at": "2015-07-28T06:15:24+05:00",
        "resource_type": "rating",
        "resource_url": "https://brewfictus.kayako.com/api/v1/cases/ratings/1"
    },
    "resource": "rating"
}
```

## Retrieve a rating by hash

GET**/api/v1/cases/:id/ratings/:hash.json**

### Information

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "score": "GOOD",
        "comment": null,
        "case": {
            "id": 1,
            "resource_type": "case"
        },
        "creator": {
            "id": 2,
            "resource_type": "user_minimal"
        },
        "assignee_agent": {
            "id": 1,
            "resource_type": "user_minimal"
        },
        "assignee_team": {
            "id": 1,
            "legacy_id": null,
            "resource_type": "team"
        },
        "created_at": "2015-07-28T06:15:24+05:00",
        "updated_at": "2015-07-28T06:15:24+05:00",
        "resource_type": "rating",
        "resource_url": "https://brewfictus.kayako.com/api/v1/cases/ratings/1"
    },
    "resource": "rating"
}
```

## Add a rating

POST**/api/v1/cases/:id/ratings.json**

### Information

Only creator of the conversation is allowed to rate their conversation.

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| hash | string |  | The hash sent in rating email |
| score | string |  |  |
| comment | string |  |  |

### Response

```
{
    "status": 201,
    "data": {
        "id": 1,
        "score": "GOOD",
        "comment": null,
        "case": {
            "id": 1,
            "resource_type": "case"
        },
        "creator": {
            "id": 2,
            "resource_type": "user_minimal"
        },
        "assignee_agent": {
            "id": 1,
            "resource_type": "user_minimal"
        },
        "assignee_team": {
            "id": 1,
            "legacy_id": null,
            "resource_type": "team"
        },
        "created_at": "2015-07-28T06:15:24+05:00",
        "updated_at": "2015-07-28T06:15:24+05:00",
        "resource_type": "rating",
        "resource_url": "https://brewfictus.kayako.com/api/v1/cases/ratings/1"
    },
    "resource": "rating"
}
```

## Update a rating

PUT**/api/v1/cases/:id/ratings/:id.json**

### Information

Only creator of the conversation is allowed to update rating of their conversation.

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| hash | string |  | The hash sent in rating email |
| score | string |  |  |
| comment | string |  |  |

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "score": "GOOD",
        "comment": null,
        "case": {
            "id": 1,
            "resource_type": "case"
        },
        "creator": {
            "id": 2,
            "resource_type": "user_minimal"
        },
        "assignee_agent": {
            "id": 1,
            "resource_type": "user_minimal"
        },
        "assignee_team": {
            "id": 1,
            "legacy_id": null,
            "resource_type": "team"
        },
        "created_at": "2015-07-28T06:15:24+05:00",
        "updated_at": "2015-07-28T06:15:24+05:00",
        "resource_type": "rating",
        "resource_url": "https://brewfictus.kayako.com/api/v1/cases/ratings/1"
    },
    "resource": "rating"
}
```

## Trigger rating

POST**/api/v1/cases/:id/ratings/trigger.json**

### Information

This triggers an email to the requester of conversation asking them to rate.

### Response

```
{
    "status": 201
}
```




### Service Level Agreements

Title: Service Level Agreements - Cases

URL Source: https://developer.kayako.com/api/v1/cases/service_level_agreements/

Markdown Content:
# Service Level Agreements - Cases | Kayako Developers

[![Image 1](https://developer.kayako.com/img/kayako-logo.png)](https://developer.kayako.com/)

*     
*   [Docs](https://developer.kayako.com/docs/single_sign_on/introduction/)
*   [API](https://developer.kayako.com/api/v1/reference/introduction/)
*   [SDK](https://developer.kayako.com/sdk/java/integration_guide/)
*   [Messenger![Image 2: beta](https://developer.kayako.com/img/new.png)](https://developer.kayako.com/messenger/home/)

*     
*   [Docs](https://developer.kayako.com/docs/single_sign_on/introduction/)
*   [API](https://developer.kayako.com/api/v1/reference/introduction/)
*   [SDK](https://developer.kayako.com/sdk/java/integration_guide/)
*   [Messenger![Image 3: beta](https://developer.kayako.com/img/new.png)](https://developer.kayako.com/messenger/home/)

Cases

*   [Reference](https://developer.kayako.com/api/v1/reference/introduction/)
Core*   [Users](https://developer.kayako.com/api/v1/users/activities/)
*   [Cases](https://developer.kayako.com/api/v1/cases/activities/)
*   [Insights](https://developer.kayako.com/api/v1/insights/cases/)
*   [Search](https://developer.kayako.com/api/v1/search/search/)
*   [Automation](https://developer.kayako.com/api/v1/automation/endpoints/)
Channels*   [Twitter](https://developer.kayako.com/api/v1/twitter/accounts/)
*   [Facebook](https://developer.kayako.com/api/v1/facebook/accounts/)
*   [Mail](https://developer.kayako.com/api/v1/mail/mailboxes/)
*   [Event](https://developer.kayako.com/api/v1/event/events/)
*   [Help Center](https://developer.kayako.com/api/v1/help_center/articles/)
Others*   [General](https://developer.kayako.com/api/v1/general/autocomplete/)

*   [Activities](https://developer.kayako.com/api/v1/cases/activities/)
*   [Cases](https://developer.kayako.com/api/v1/cases/cases/)
*   [Fields](https://developer.kayako.com/api/v1/cases/fields/)
*   [Forms](https://developer.kayako.com/api/v1/cases/forms/)
*   [Macros](https://developer.kayako.com/api/v1/cases/macros/)
*   [Merge](https://developer.kayako.com/api/v1/cases/merge/)
*   [Metrics](https://developer.kayako.com/api/v1/cases/metrics/)
*   [Notes](https://developer.kayako.com/api/v1/cases/notes/)
*   [Priorities](https://developer.kayako.com/api/v1/cases/priorities/)
*   [Satisfaction Ratings](https://developer.kayako.com/api/v1/cases/satisfaction_ratings/)
*   [Service Level Agreements](https://developer.kayako.com/api/v1/cases/service_level_agreements/)
    *   [Resource fields](https://developer.kayako.com/api/v1/cases/service_level_agreements/#resource-fields)
    *   [Retrieve all SLAs](https://developer.kayako.com/api/v1/cases/service_level_agreements/#Retrieve-all-SLAs)
    *   [Retrieve an SLA](https://developer.kayako.com/api/v1/cases/service_level_agreements/#Retrieve-an-SLA)
    *   [Add an SLA](https://developer.kayako.com/api/v1/cases/service_level_agreements/#Add-an-SLA)
    *   [Update an SLA](https://developer.kayako.com/api/v1/cases/service_level_agreements/#Update-an-SLA)
    *   [Update SLAs](https://developer.kayako.com/api/v1/cases/service_level_agreements/#Update-SLAs)
    *   [Reorder SLAs](https://developer.kayako.com/api/v1/cases/service_level_agreements/#Reorder-SLAs)
    *   [Delete an SLA](https://developer.kayako.com/api/v1/cases/service_level_agreements/#Delete-an-SLA)
    *   [Delete SLAs](https://developer.kayako.com/api/v1/cases/service_level_agreements/#Delete-SLAs)
    *   [Definitions](https://developer.kayako.com/api/v1/cases/service_level_agreements/#Definitions)
        *   [Retrieve all definitions](https://developer.kayako.com/api/v1/cases/service_level_agreements/#Definitions__Retrieve-all-definitions)
        *   [Autocomplete](https://developer.kayako.com/api/v1/cases/service_level_agreements/#Definitions__Autocomplete)

*   [Statuses](https://developer.kayako.com/api/v1/cases/statuses/)
*   [Tags](https://developer.kayako.com/api/v1/cases/tags/)
*   [Timetracking](https://developer.kayako.com/api/v1/cases/timetracking/)
*   [Types](https://developer.kayako.com/api/v1/cases/types/)
*   [Views](https://developer.kayako.com/api/v1/cases/views/)

1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   CORE
4.   CASES

# Service Level Agreements

## Resource Fields

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| title | string |  |  |
| description | string |  |  |
| execution_order | integer |  |  |
| predicate_collections | [Collections](https://developer.kayako.com/api/v1/cases/service_level_agreements/#collections) |  |  |
| targets | [Target](https://developer.kayako.com/api/v1/cases/service_level_agreements/#targets) |  |  |
| is_enabled | boolean |  |  |
| is_deleted | boolean |  |  |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Collections

### RESOURCE FIELDS

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| propositions | [Propositions](https://developer.kayako.com/api/v1/cases/service_level_agreements/#propositions) |  |  |

## Propositions

### RESOURCE FIELDS

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| field | string |  | The field should be out of fields given by [Definitions](https://developer.kayako.com/api/v1/cases/service_level_agreements/#Definitions) resource |
| operator | string |  | The operator should also belong to the defined one for a [Definitions](https://developer.kayako.com/api/v1/cases/service_level_agreements/#propositions) field |
| value | mixed |  |  |

## Targets

### RESOURCE FIELDS

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| priority | [Priority](https://developer.kayako.com/api/v1/cases/priorities/) |  |  |
| type | string |  | `FIRST_REPLY_TIME`, `NEXT_REPLY_TIME`, `RESOLUTION_TIME` |
| goal_in_seconds | integer |  |  |
| operational_hours | string |  | `BUSINESS_HOURS`, `CALENDAR_HOURS` |

## Metadata

Version 1.0
Last Updated July 04, 2016

## Actions

## Retrieve all SLAs

GET**/api/v1/slas.json**

### Information

Allowed for Admins & Owners
Scope[configuration](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)
Ordered by updated_at (descending)

### Response

```text
{
    "status": 200,
    "data": [
        {
            "id": 2,
            "title": "High priority sales and support tickets",
            "description": null,
            "execution_order": 2,
            "predicate_collections": [
                {
                    "id": 4,
                    "propositions": [
                        {
                            "id": 1,
                            "resource_type": "sla_proposition"
                        }
                    ],
                    "resource_type": "predicate_collection"
                }
            ],
            "targets": [
                {
                    "id": 10,
                    "resource_type": "sla_target"
                }
            ],
            "is_enabled": true,
            "is_deleted": false,
            "created_at": "2015-07-31T05:18:50+05:00",
            "updated_at": "2015-07-31T05:18:50+05:00",
            "resource_type": "sla",
            "resource_url": "https://brewfictus.kayako.com/api/v1/slas/2"
        }
    ],
    "resource": "sla",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Retrieve an SLA

GET**/api/v1/slas/:id.json**

### Information

Allowed for Admins & Owners
Scope[configuration](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Response

```text
{
    "status": 200,
    "data": {
        "id": 2,
        "title": "High priority sales and support tickets",
        "description": null,
        "execution_order": 2,
        "predicate_collections": [
            {
                "id": 4,
                "propositions": [
                    {
                        "id": 1,
                        "resource_type": "sla_proposition"
                    }
                ],
                "resource_type": "predicate_collection"
            }
        ],
        "targets": [
            {
                "id": 10,
                "resource_type": "sla_target"
            }
        ],
        "is_enabled": true,
        "is_deleted": false,
        "created_at": "2015-07-31T05:18:50+05:00",
        "updated_at": "2015-07-31T05:18:50+05:00",
        "resource_type": "sla",
        "resource_url": "https://brewfictus.kayako.com/api/v1/slas/2"
    },
    "resource": "sla"
}
```

## Add an SLA

POST**/api/v1/slas.json**

### Information

Allowed for Admins & Owners
Scope[configuration](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| title | string |  |  |
| description | string |  |  |
| is_enabled | boolean |  |  |
| predicate_collections[] | array |  | Fetch the [definition](https://developer.kayako.com/api/v1/cases/service_level_agreements/#Definitions) at first to get field, operator and available values. There can be multiple [collections](https://developer.kayako.com/api/v1/cases/service_level_agreements/#resource-fields) and a collection can have multiple [propositions](https://developer.kayako.com/api/v1/cases/service_level_agreements/#resource-fields). Collections are evaluated with **AND** operator and Propositions are evaluated with **OR** operator. **Example:** `[{"propositions":[{"field":"cases.casestatusid", "operator":"comparison_equalto", "value":1}, {"field":"cases.channeltype", "operator":"comparison_equalto", "value":"MAIL"}]}]` |
| targets[] | array |  | Properties that are required to define a target are priority_id, type, goal_in_seconds, operational_hours described as below **priority_id:** integer, can be `null` for No priority target **type:** string, `FIRST_REPLY_TIME`, `NEXT_REPLY_TIME`, `RESOLUTION_TIME` **goal_in_seconds:** integer **operational_hours:** string, `BUSINESS_HOURS`, `CALENDAR_HOURS` **Example:** `targets[] = {"priority_id": null, "type": "FIRST_REPLY_TIME", "goal_in_seconds": 16200, "operational_hours": "BUSINESS_HOURS"}` `targets[] = {"priority_id": null, "type": "RESOLUTION_TIME", "goal_in_seconds": 16200, "operational_hours": "CALENDAR_HOURS"}` |

### Response

```text
{
    "status": 201,
    "data": {
        "id": 2,
        "title": "High priority sales and support tickets",
        "description": null,
        "execution_order": 2,
        "predicate_collections": [
            {
                "id": 4,
                "propositions": [
                    {
                        "id": 1,
                        "resource_type": "sla_proposition"
                    }
                ],
                "resource_type": "predicate_collection"
            }
        ],
        "targets": [
            {
                "id": 10,
                "resource_type": "sla_target"
            }
        ],
        "is_enabled": true,
        "is_deleted": false,
        "created_at": "2015-07-31T05:18:50+05:00",
        "updated_at": "2015-07-31T05:18:50+05:00",
        "resource_type": "sla",
        "resource_url": "https://brewfictus.kayako.com/api/v1/slas/2"
    },
    "resource": "sla"
}
```

## Update an SLA

PUT**/api/v1/slas/:id.json**

### Information

Allowed for Admins & Owners
Scope[configuration](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| title | string |  |  |
| description | string |  |  |
| predicate_collections[] | array |  | **Example:** `[{"id":1, "propositions":[{"id":1, "field":"cases.casestatusid", "operator":"comparison_equalto", "value":1}, {"id":2, "field":"cases.channeltype", "operator":"comparison_equalto", "value":"MAIL"}, {"id":null, "field":"cases.casepriorityid", "operator":"comparison_equalto", "value":1}]}]` |
| targets[] | array |  | Existing targets are replaced by given filters. Make sure you send all targets during update same as [add](https://developer.kayako.com/api/v1/cases/service_level_agreements/#Add-an-SLA). **Example:** `targets[] = {"id": 1, "priority_id": null, "type": "FIRST_REPLY_TIME", "goal_in_seconds": 19800, "operational_hours": "BUSINESS_HOURS"}` `targets[] = {"id": null, "priority_id": 1, "type": "RESOLUTION_TIME", "goal_in_seconds": 14400, "operational_hours": "CALENDAR_HOURS"}` |
| is_enabled | boolean |  |  |

### Response

```text
{
    "status": 200,
    "data": {
        "id": 2,
        "title": "High priority sales and support tickets",
        "description": null,
        "execution_order": 2,
        "predicate_collections": [
            {
                "id": 4,
                "propositions": [
                    {
                        "id": 1,
                        "resource_type": "sla_proposition"
                    }
                ],
                "resource_type": "predicate_collection"
            }
        ],
        "targets": [
            {
                "id": 10,
                "resource_type": "sla_target"
            }
        ],
        "is_enabled": true,
        "is_deleted": false,
        "created_at": "2015-07-31T05:18:50+05:00",
        "updated_at": "2015-07-31T05:18:50+05:00",
        "resource_type": "sla",
        "resource_url": "https://brewfictus.kayako.com/api/v1/slas/2"
    },
    "resource": "sla"
}
```

## Update SLAs

PUT**/api/v1/slas.json**

### Information

Allowed for Admins & Owners
Scope[configuration](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  |  |

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| is_enabled | boolean |  |  |

### Response

```text
{
    "status": 200,
    "total_count": 2
}
```

## Reorder SLAs

PUT**/api/v1/slas/reorder.json**

### Information

Allowed for Admins & Owners
Scope[configuration](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| sla_ids | string |  | Comma separated SLA IDs in order you want. **Example:** sla_ids = 2,3,1 will set the first order for SLA Id 2, second for 3 and third for ID 1 |

### Response

```text
{
    "status": 200,
}
```

## Delete an SLA

DELETE**/api/v1/slas/:id.json**

### Information

Allowed for Admins & Owners
Scope[configuration](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Response

```text
{
    "status": 200
}
```

## Delete SLAs

DELETE**/api/v1/slas.json**

### Information

Allowed for Admins & Owners
Scope[configuration](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Response

```text
{
    "status": 200,
    "total_count": 2
}
```

## Definitions

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| label | string |  |  |
| field | string |  | Field name on which the rules will be applied |
| type | string |  | `NUMERIC`, `FLOAT`, `STRING`, `BOOLEAN`, `COLLECTION`, `DATE_ABSOLUTE`, `DATE_RELATIVE`, `TIME` |
| sub_type | string |  | Depends on type: `NUMERIC`: `FLOAT`, `INTEGER` `DATE_RELATIVE`: `PAST`, `PAST_OR_PRESENT`, `PRESENT`, `PAST_OR_FUTURE`, `FUTURE` |
| group | string |  | `CASES`, `REQUESTER`, `ORGANIZATION`, `SLA` |
| rarity | string |  | `COMMON`, `LESS_COMMON` |
| description | string |  | Field description |
| input_type | string |  | `INTEGER`, `FLOAT`, `STRING`, `BOOLEAN`, `BOOLEAN_TRUE`, `BOOLEAN_FALSE`, `OPTIONS`, `MULTIPLE`, `TAGS`, `DATE_ABSOLUTE`, `DATE_RELATIVE`, `AUTOCOMPLETE`, `TIME` |
| operators | array |  | Depends on input_type: `INTEGER`, `FLOAT`: `comparison_equalto`, `comparison_not_equalto`, `comparison_greaterthan`, `comparison_greaterthan_or_equalto`, `comparison_lessthan`, `comparison_lessthan_or_equalto` `STRING`: `string_contains_insensitive`, `string_does_not_contain_insensitive` `BOOLEAN`: `comparison_equalto`, `comparison_not_equalto` `BOOLEAN_TRUE`: `comparison_equalto` `BOOLEAN_FALSE`: `comparison_equalto` `OPTIONS`: `comparison_equalto`, `comparison_not_equalto` `TAGS`: `collection_contains_insensitive`, `collection_contains_any_insensitive` `AUTOCOMPLETE`: `comparison_equalto`, `comparison_not_equalto` `TIME`: `time_greaterthan`, `time_greaterthan_or_equalto`, `time_lessthan`, `time_lessthan_or_equalto` `DATE_ABSOLUTE`: `date_is`, `date_is_not` `DATE_RELATIVE`: `date_after`, `date_after_or_on`, `date_before`, `date_before_or_on` |
| values | mixed |  | Values for a definition with input_type as [AUTOCOMPLETE](https://developer.kayako.com/api/v1/cases/service_level_agreements/#Definitions__Autocomplete) will not be provided by the server |

## Retrieve all definitions

GET**/api/v1/slas/definitions.json**

### Information

Allowed for Admins & Owners
Scope[configuration](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Response

```text
{
    "status": 200,
    "data": [
        {
            "label": "Type",
            "field": "cases.casetypeid",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Conversation type",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "0": "none",
                "1": "Question",
                "2": "Task",
                "3": "Problem",
                "4": "Incident"
            },
            "resource_type": "definition"
        },
        {
            "label": "Team",
            "field": "cases.assigneeteamid",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Team assigned to conversation",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "0": "(Unassigned)",
                "1": "General"
            },
            "resource_type": "definition"
        },
        {
            "label": "Assignee",
            "field": "cases.assigneeagentid",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Agent assigned to conversation",
            "input_type": "AUTOCOMPLETE",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "0": "(Unassigned)",
                "(requester)": "(Requester)"
            },
            "resource_type": "definition"
        },
        {
            "label": "Requester",
            "field": "cases.requesterid",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Requester of the conversation",
            "input_type": "AUTOCOMPLETE",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "(assignee)": "(Assignee)"
            },
            "resource_type": "definition"
        },
        {
            "label": "Tags",
            "field": "tags.name",
            "type": "COLLECTION",
            "sub_type": "",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Tags added to conversation",
            "input_type": "TAGS",
            "operators": [
                "collection_contains_insensitive",
                "collection_contains_any_insensitive",
                "collection_does_not_contain_insensitive"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Organization",
            "field": "users.organizationid",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Requester's organization",
            "input_type": "AUTOCOMPLETE",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Source Channel",
            "field": "cases.channel",
            "type": "STRING",
            "sub_type": "",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Channel over which the conversation was started",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "MAIL": "Mail",
                "MESSENGER": "Messenger",
                "FACEBOOK": "Facebook",
                "TWITTER": "Twitter",
                "NOTE": "Note",
                "HELPCENTER": "Helpcenter"
            },
            "resource_type": "definition"
        },
        {
            "label": "Brand",
            "field": "cases.brandid",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Brand to which conversation belongs",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "1": "Brewfictus"
            },
            "resource_type": "definition"
        },
        {
            "label": "Form",
            "field": "cases.caseformid",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Form linked to conversation",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "0": "none",
                "1": "Default"
            },
            "resource_type": "definition"
        }
    ],
    "resource": "definition",
    "total_count": 9
}
```

## Autocomplete

### Autocomplete

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| users.organizationid | [Organization](https://developer.kayako.com/api/v1/general/autocomplete/#Organizations__Lookup-organizations) |  |  |
| cases.requesterid | [User](https://developer.kayako.com/api/v1/general/autocomplete/#Users__Lookup-users) |  |  |
| cases.assigneeagentid | [User](https://developer.kayako.com/api/v1/general/autocomplete/#Users__Lookup-users) |  | `Filter by multiple comma separated values`OWNERS`,`ADMINS`,`AGENTS`,`COLLABORATORS` |

 Copyright © 2018 [Kayako](http://www.kayako.com/). All rights reserved • [Privacy Policy](http://www.kayako.com/about/privacy)

[](https://www.facebook.com/kayako/)[](https://twitter.com/kayako)




### Statuses

Title: Statuses - Cases | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/cases/statuses/

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   CORE
4.   CASES

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| label | string |  |  |
| type | string |  | `NEW`, `OPEN`, `PENDING`, `COMPLETED`, `CLOSED`, `CUSTOM` |
| sort_order | integer |  |  |
| is_sla_active | boolean |  | **Default:**`true` |
| is_deleted | boolean |  |  |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve all statuses

GET**/api/v1/cases/statuses.json**

### Information

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "label": "New",
            "type": "NEW",
            "sort_order": 1,
            "is_sla_active": true,
            "is_deleted": false,
            "created_at": "2015-07-21T10:39:32+05:00",
            "updated_at": "2015-07-21T10:39:32+05:00",
            "resource_type": "case_status",
            "resource_url": "https://brewfictus.kayako.com/api/v1/cases/statuses/1"
        }
    ],
    "resource": "case_status",
    "total_count": 1
}
```

## Retrieve a status

GET**/api/v1/cases/statuses/:id.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "label": "New",
        "type": "NEW",
        "sort_order": 1,
        "is_sla_active": true,
        "is_deleted": false,
        "created_at": "2015-07-21T10:39:32+05:00",
        "updated_at": "2015-07-21T10:39:32+05:00",
        "resource_type": "case_status",
        "resource_url": "https://brewfictus.kayako.com/api/v1/cases/statuses/1"
    },
    "resource": "case_status"
}
```

## Add a status

POST**/api/v1/cases/statuses.json**

### Information

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| label | string |  |  |
| is_sla_active | boolean |  | **Default:**`true` |
| sort_order | integer |  |  |

### Response

```
{
    "status": 201,
    "data": {
        "id": 1,
        "label": "New",
        "type": "NEW",
        "sort_order": 1,
        "is_sla_active": true,
        "is_deleted": false,
        "created_at": "2015-07-21T10:39:32+05:00",
        "updated_at": "2015-07-21T10:39:32+05:00",
        "resource_type": "case_status",
        "resource_url": "https://brewfictus.kayako.com/api/v1/cases/statuses/1"
    },
    "resource": "case_status"
}
```

## Update a status

PUT**/api/v1/cases/statuses/:id.json**

### Information

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| label | string |  |  |
| is_sla_active | boolean |  |  |
| sort_order | integer |  |  |

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "label": "New",
        "type": "NEW",
        "sort_order": 1,
        "is_sla_active": true,
        "is_deleted": false,
        "created_at": "2015-07-21T10:39:32+05:00",
        "updated_at": "2015-07-21T10:39:32+05:00",
        "resource_type": "case_status",
        "resource_url": "https://brewfictus.kayako.com/api/v1/cases/statuses/1"
    },
    "resource": "case_status"
}
```

## Reorder statuses

PUT**/api/v1/cases/statuses/reorder.json**

### Information

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| status_ids | string |  | Pass the custom statuses in order you want to set |

### Response

```
{
    "status": 200
}
```

## Delete a status

DELETE**/api/v1/cases/statuses/:id.json**

### Information

_Note:_ Deleting a status will remove status from conversations, macros

### Response

```
{
    "status": 200
}
```

## Delete statuses

DELETE**/api/v1/cases/statuses.json**

### Information

_Note:_ Deleting a status will remove status from conversations, macros

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```




### Tags

Title: Tags - Cases | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/cases/tags/

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   CORE
4.   CASES

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |

## Add tags

POST**/api/v1/cases/:id/tags.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| tags | string |  | Comma separated tags |

### Response

```
{
    "status": 201,
    "data": [
        {
            "id": 1,
            "name": "important",
            "resource_type": "tag"
        }
    ],
    "resource": "tag",
    "total_count": 1
}
```

## Replace tags

PUT**/api/v1/cases/:id/tags.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| tags | string |  | Comma separated tags |

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "name": "important",
            "resource_type": "tag"
        }
    ],
    "resource": "tag",
    "total_count": 1
}
```

## Remove tags

DELETE**/api/v1/cases/:id/tags.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| tags | string |  | Comma separated tags |

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "name": "important",
            "resource_type": "tag"
        }
    ],
    "resource": "tag",
    "total_count": 1
}
```




### Timetracking

Title: Timetracking - Cases | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/cases/timetracking/

Published Time: Thu, 15 Feb 2018 07:35:46 GMT

Markdown Content:
```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "time_tracking_log_id": 1,
            "case": {
                "id": 1,
                "resource_type": "case"
            },
            "agent": {
                "id": 5,
                "resource_type": "user"
            },
            "log_type": "WORKED",
            "time_spent": 467,
            "creator": {
                "id": 1,
                "resource_type": "user"
            },
            "created_at": 1498466226,
            "resource_type": "timetracking_log",
            "resource_url": "https://brewfictus.kayako.com/api/v1/cases/time_track/log/1"
        },
        {
            "id": 2,
            "time_tracking_log_id": 2,
            "case": {
                "id": 1,
                "resource_type": "case"
            },
            "agent": {
                "id": 5,
                "resource_type": "user"
            },
            "log_type": "WORKED",
            "time_spent": 682,
            "creator": {
                "id": 1,
                "resource_type": "user"
            },
            "created_at": 1498466226,
            "resource_type": "timetracking_log",
            "resource_url": "https://brewfictus.kayako.com/api/v1/cases/time_track/log/2"
        },
        {
            "id": 3,
            "time_tracking_log_id": 3,
            "case": {
                "id": 1,
                "resource_type": "case"
            },
            "agent": {
                "id": 2,
                "resource_type": "user"
            },
            "log_type": "WORKED",
            "time_spent": 138,
            "creator": {
                "id": 1,
                "resource_type": "user"
            },
            "created_at": 1498466226,
            "resource_type": "timetracking_log",
            "resource_url": "https://brewfictus.kayako.com/api/v1/cases/time_track/log/3"
        },
        {
            "id": 4,
            "time_tracking_log_id": 4,
            "case": {
                "id": 1,
                "resource_type": "case"
            },
            "agent": {
                "id": 4,
                "resource_type": "user"
            },
            "log_type": "BILLED",
            "time_spent": 807,
            "creator": {
                "id": 1,
                "resource_type": "user"
            },
            "created_at": 1498466228,
            "resource_type": "timetracking_log",
            "resource_url": "https://brewfictus.kayako.com/api/v1/cases/time_track/log/4"
        },
        {
            "id": 5,
            "time_tracking_log_id": 5,
            "case": {
                "id": 1,
                "resource_type": "case"
            },
            "agent": {
                "id": 2,
                "resource_type": "user"
            },
            "log_type": "BILLED",
            "time_spent": 689,
            "creator": {
                "id": 1,
                "resource_type": "user"
            },
            "created_at": 1498466229,
            "resource_type": "timetracking_log",
            "resource_url": "https://brewfictus.kayako.com/api/v1/cases/time_track/log/5"
        },
        {
            "id": 6,
            "time_tracking_log_id": 6,
            "case": {
                "id": 1,
                "resource_type": "case"
            },
            "agent": {
                "id": 5,
                "resource_type": "user"
            },
            "log_type": "WORKED",
            "time_spent": 436,
            "creator": {
                "id": 1,
                "resource_type": "user"
            },
            "created_at": 1498466229,
            "resource_type": "timetracking_log",
            "resource_url": "https://brewfictus.kayako.com/api/v1/cases/time_track/log/6"
        },
        {
            "id": 7,
            "time_tracking_log_id": 7,
            "case": {
                "id": 1,
                "resource_type": "case"
            },
            "agent": {
                "id": 4,
                "resource_type": "user"
            },
            "log_type": "WORKED",
            "time_spent": 361,
            "creator": {
                "id": 1,
                "resource_type": "user"
            },
            "created_at": 1498466229,
            "resource_type": "timetracking_log",
            "resource_url": "https://brewfictus.kayako.com/api/v1/cases/time_track/log/7"
        },
        {
            "id": 8,
            "time_tracking_log_id": 8,
            "case": {
                "id": 1,
                "resource_type": "case"
            },
            "agent": {
                "id": 1,
                "resource_type": "user"
            },
            "log_type": "VIEWED",
            "time_spent": 896,
            "creator": {
                "id": 1,
                "resource_type": "user"
            },
            "created_at": 1498466229,
            "resource_type": "timetracking_log",
            "resource_url": "https://brewfictus.kayako.com/api/v1/cases/time_track/log/8"
        },
        {
            "id": 9,
            "time_tracking_log_id": 9,
            "case": {
                "id": 1,
                "resource_type": "case"
            },
            "agent": {
                "id": 4,
                "resource_type": "user"
            },
            "log_type": "BILLED",
            "time_spent": 263,
            "creator": {
                "id": 1,
                "resource_type": "user"
            },
            "created_at": 1498466231,
            "resource_type": "timetracking_log",
            "resource_url": "https://brewfictus.kayako.com/api/v1/cases/time_track/log/9"
        },
        {
            "id": 10,
            "time_tracking_log_id": 10,
            "case": {
                "id": 1,
                "resource_type": "case"
            },
            "agent": {
                "id": 2,
                "resource_type": "user"
            },
            "log_type": "WORKED",
            "time_spent": 954,
            "creator": {
                "id": 1,
                "resource_type": "user"
            },
            "created_at": 1498466232,
            "resource_type": "timetracking_log",
            "resource_url": "https://brewfictus.kayako.com/api/v1/cases/time_track/log/10"
        }
    ],
    "resource": "timetracking_log",
    "offset": 0,
    "limit": 10,
    "total_count": 71,
    "next_url": "https://brewfictus.kayako.com/api/v1/timetracking?offset=10",
    "last_url": "https://brewfictus.kayako.com/api/v1/timetracking?offset=70"
}
```




### Types

Title: Types - Cases | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/cases/types/

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   CORE
4.   CASES

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| label | string |  |  |
| type | string |  | `QUESTION`, `TASK`, `PROBLEM`, `INCIDENT`, `CUSTOM` |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve all types

GET**/api/v1/cases/types.json**

### Information

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "label": "Question",
            "type": "QUESTION",
            "created_at": "2015-07-21T10:39:32+05:00",
            "updated_at": "2015-07-21T10:39:32+05:00",
            "resource_type": "case_type",
            "resource_url": "https://brewfictus.kayako.com/api/v1/cases/types/1"
        }
    ],
    "resource": "case_type",
    "total_count": 1
}
```

## Retrieve a type

GET**/api/v1/cases/types/:id.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "label": "Question",
        "type": "QUESTION",
        "created_at": "2015-07-21T10:39:32+05:00",
        "updated_at": "2015-07-21T10:39:32+05:00",
        "resource_type": "case_type",
        "resource_url": "https://brewfictus.kayako.com/api/v1/cases/types/1"
    },
    "resource": "case_type"
}
```

## Add a type

POST**/api/v1/cases/types.json**

### Information

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| label | string |  |  |

### Response

```
{
    "status": 201,
    "data": {
        "id": 1,
        "label": "Question",
        "type": "QUESTION",
        "created_at": "2015-07-21T10:39:32+05:00",
        "updated_at": "2015-07-21T10:39:32+05:00",
        "resource_type": "case_type",
        "resource_url": "https://brewfictus.kayako.com/api/v1/cases/types/1"
    },
    "resource": "case_type"
}
```

## Update a type

PUT**/api/v1/cases/types/:id.json**

### Information

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| label | string |  |  |

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "label": "Question",
        "type": "QUESTION",
        "created_at": "2015-07-21T10:39:32+05:00",
        "updated_at": "2015-07-21T10:39:32+05:00",
        "resource_type": "case_type",
        "resource_url": "https://brewfictus.kayako.com/api/v1/cases/types/1"
    },
    "resource": "case_type"
}
```

## Delete a type

DELETE**/api/v1/cases/types/:id.json**

### Information

_Note:_ Deleting a type will remove type from conversations, macros

### Response

```
{
    "status": 200
}
```

## Delete types

DELETE**/api/v1/cases/types.json**

### Information

_Note:_ Deleting a type will remove type from conversations, macros

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```




### Views

Title: Views - Cases | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/cases/views/

Markdown Content:
```
{
    "status": 200,
    "data": [
        {
            "label": "Subject",
            "field": "cases.subject",
            "type": "STRING",
            "sub_type": "",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Conversation's subject",
            "input_type": "STRING",
            "operators": [
                "string_contains_insensitive",
                "string_does_not_contain_insensitive"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Status",
            "field": "cases.casestatusid",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Status of conversation",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "1": "New",
                "2": "Open",
                "3": "Pending",
                "4": "Completed"
            },
            "resource_type": "definition"
        },
        {
            "label": "Priority",
            "field": "cases.casepriorityid",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Priority of conversation",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto",
                "comparison_lessthan",
                "comparison_greaterthan"
            ],
            "values": {
                "0": "none",
                "1": "Low",
                "2": "Normal",
                "3": "High",
                "4": "Urgent"
            },
            "resource_type": "definition"
        },
        {
            "label": "Type",
            "field": "cases.casetypeid",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Conversation type",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "0": "none",
                "1": "Question",
                "2": "Task",
                "3": "Problem",
                "4": "Incident"
            },
            "resource_type": "definition"
        },
        {
            "label": "Team",
            "field": "cases.assigneeteamid",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Team assigned to conversation",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "0": "(Unassigned)",
                "1": "General",
                "(current_users_team)": "(current user's team)"
            },
            "resource_type": "definition"
        },
        {
            "label": "Assignee",
            "field": "cases.assigneeagentid",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Agent assigned to conversation",
            "input_type": "AUTOCOMPLETE",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "0": "(Unassigned)",
                "(current_user)": "(Current user)",
                "(requester)": "(Requester)"
            },
            "resource_type": "definition"
        },
        {
            "label": "Requester",
            "field": "cases.requesterid",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Requester of the conversation",
            "input_type": "AUTOCOMPLETE",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "(current_user)": "(Current user)",
                "(assignee)": "(Assignee)"
            },
            "resource_type": "definition"
        },
        {
            "label": "Organization",
            "field": "users.organizationid",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Requester's organization",
            "input_type": "AUTOCOMPLETE",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Tags",
            "field": "tags.name",
            "type": "COLLECTION",
            "sub_type": "",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Tags added to conversation",
            "input_type": "TAGS",
            "operators": [
                "collection_contains_insensitive",
                "collection_contains_any_insensitive",
                "collection_does_not_contain_insensitive"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Brand",
            "field": "cases.brandid",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Brand to which conversation belongs",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "1": "Brewfictus"
            },
            "resource_type": "definition"
        },
        {
            "label": "Source Channel",
            "field": "cases.channel",
            "type": "STRING",
            "sub_type": "",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Channel over which the conversation was started",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "MAIL": "Mail",
                "MESSENGER": "Messenger",
                "FACEBOOK": "Facebook",
                "TWITTER": "Twitter",
                "NOTE": "Note",
                "HELPCENTER": "Helpcenter"
            },
            "resource_type": "definition"
        },
        {
            "label": "Satisfaction status",
            "field": "cases.satisfactionstatus",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "SATISFACTION",
            "rarity": "COMMON",
            "description": "The status of satisfaction offering for the conversation",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "1": "UNOFFERED",
                "2": "OFFERED",
                "3": "RECEIVED"
            },
            "resource_type": "definition"
        },
        {
            "label": "Satisfaction rating",
            "field": "cases.rating",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "SATISFACTION",
            "rarity": "COMMON",
            "description": "Satisfaction rating for the conversation",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "0": "Not set",
                "1": "Good",
                "-1": "Bad"
            },
            "resource_type": "definition"
        },
        {
            "label": "SLA",
            "field": "cases.slaversionid",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "SLA",
            "rarity": "COMMON",
            "description": "SLA that's applied to the conversation",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "0": "none",
                "1": "VIP Customer"
            },
            "resource_type": "definition"
        },
        {
            "label": "SLA breached",
            "field": "cases.isslabreached",
            "type": "BOOLEAN",
            "sub_type": "",
            "group": "SLA",
            "rarity": "COMMON",
            "description": "Whether or not the conversation has breached any of its SLA targets",
            "input_type": "BOOLEAN_TRUE",
            "operators": [
                "comparison_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Number of reopens",
            "field": "casemetrics.reopencount",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "LESS_COMMON",
            "description": "Number of times conversation has been reopened",
            "input_type": "INTEGER",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto",
                "comparison_greaterthan",
                "comparison_greaterthan_or_equalto",
                "comparison_lessthan",
                "comparison_lessthan_or_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Number of agent replies",
            "field": "casemetrics.agentreplycount",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "LESS_COMMON",
            "description": "Number of agent replies on conversation",
            "input_type": "INTEGER",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto",
                "comparison_greaterthan",
                "comparison_greaterthan_or_equalto",
                "comparison_lessthan",
                "comparison_lessthan_or_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Number of requester replies",
            "field": "casemetrics.requesterreplycount",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "LESS_COMMON",
            "description": "Number of times requester has replied",
            "input_type": "INTEGER",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto",
                "comparison_greaterthan",
                "comparison_greaterthan_or_equalto",
                "comparison_lessthan",
                "comparison_lessthan_or_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Number of replies",
            "field": "casemetrics.replycount",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "LESS_COMMON",
            "description": "Number of total replies on a conversation",
            "input_type": "INTEGER",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto",
                "comparison_greaterthan",
                "comparison_greaterthan_or_equalto",
                "comparison_lessthan",
                "comparison_lessthan_or_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Number of agent reassignments",
            "field": "casemetrics.assigneechangecount",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "LESS_COMMON",
            "description": "Number of times assignee has been changed",
            "input_type": "INTEGER",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto",
                "comparison_greaterthan",
                "comparison_greaterthan_or_equalto",
                "comparison_lessthan",
                "comparison_lessthan_or_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Number of team reassignments",
            "field": "casemetrics.teamchangecount",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "LESS_COMMON",
            "description": "Number of times team has been changed",
            "input_type": "INTEGER",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto",
                "comparison_greaterthan",
                "comparison_greaterthan_or_equalto",
                "comparison_lessthan",
                "comparison_lessthan_or_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Last update by user",
            "field": "cases.lastupdatedby",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "LESS_COMMON",
            "description": "User who made the last update",
            "input_type": "AUTOCOMPLETE",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "(assignee)": "(Assignee)",
                "(requester)": "(Requester)"
            },
            "resource_type": "definition"
        },
        {
            "label": "Last update by user role",
            "field": "roles.type",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "LESS_COMMON",
            "description": "Role of the user who made the last update",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "1": "Owner",
                "2": "Admin",
                "3": "Agent",
                "4": "Collaborator",
                "5": "Customer"
            },
            "resource_type": "definition"
        },
        {
            "label": "Language",
            "field": "users.languageid",
            "type": "STRING",
            "sub_type": "",
            "group": "REQUESTER",
            "rarity": "LESS_COMMON",
            "description": "Requester's language",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "2": "en-us"
            },
            "resource_type": "definition"
        },
        {
            "label": "Timezone",
            "field": "users.timezone",
            "type": "STRING",
            "sub_type": "",
            "group": "REQUESTER",
            "rarity": "LESS_COMMON",
            "description": "Requester's timezone",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "Africa/Abidjan": "Africa/Abidjan",
                "Africa/Accra": "Africa/Accra",
                "UTC": "UTC"
            },
            "resource_type": "definition"
        },
        {
            "label": "Tags",
            "field": "requester.tags",
            "type": "COLLECTION",
            "sub_type": "",
            "group": "REQUESTER",
            "rarity": "COMMON",
            "description": "Tags that have been added to the organization's profile",
            "input_type": "TAGS",
            "operators": [
                "collection_contains_insensitive",
                "collection_contains_any_insensitive",
                "collection_does_not_contain_insensitive"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Tags",
            "field": "organization.tags",
            "type": "COLLECTION",
            "sub_type": "",
            "group": "ORGANIZATION",
            "rarity": "COMMON",
            "description": "Tags that have been added to the organization's profile",
            "input_type": "TAGS",
            "operators": [
                "collection_contains_insensitive",
                "collection_contains_any_insensitive",
                "collection_does_not_contain_insensitive"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Form",
            "field": "cases.caseformid",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Form linked to conversation",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "0": "none",
                "1": "Default"
            },
            "resource_type": "definition"
        },
        {
            "label": "State",
            "field": "cases.state",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "LESS_COMMON",
            "description": "Whether conversation is in the trash",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "1": "ACTIVE",
                "2": "TRASH"
            },
            "resource_type": "definition"
        },
        {
            "label": "Time since conversation created",
            "field": "cases.createdat",
            "type": "TIME",
            "sub_type": "PAST",
            "group": "CASES",
            "rarity": "LESS_COMMON",
            "description": "Amount of time since the conversation was created",
            "input_type": "TIME",
            "operators": [
                "time_greaterthan",
                "time_greaterthan_or_equalto",
                "time_lessthan",
                "time_lessthan_or_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Time since last update",
            "field": "cases.updatedat",
            "type": "TIME",
            "sub_type": "PAST",
            "group": "CASES",
            "rarity": "LESS_COMMON",
            "description": "Amount of time since the last update to the conversation",
            "input_type": "TIME",
            "operators": [
                "time_greaterthan",
                "time_greaterthan_or_equalto",
                "time_lessthan",
                "time_lessthan_or_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Time since latest update made by assignee",
            "field": "cases.lastagentactivityat",
            "type": "TIME",
            "sub_type": "PAST",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Amount of time since the assignee updated the conversation",
            "input_type": "TIME",
            "operators": [
                "time_greaterthan",
                "time_greaterthan_or_equalto",
                "time_lessthan",
                "time_lessthan_or_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Time since latest update made by requester",
            "field": "casemetrics.lastrequesteractivityat",
            "type": "TIME",
            "sub_type": "PAST",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Amount of time since the requester updated the conversation",
            "input_type": "TIME",
            "operators": [
                "time_greaterthan",
                "time_greaterthan_or_equalto",
                "time_lessthan",
                "time_lessthan_or_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Time since requester received a reply",
            "field": "casemetrics.agentlastpostcreatedat",
            "type": "TIME",
            "sub_type": "PAST",
            "group": "CASES",
            "rarity": "LESS_COMMON",
            "description": "Amount of time since the requester received a reply",
            "input_type": "TIME",
            "operators": [
                "time_greaterthan",
                "time_greaterthan_or_equalto",
                "time_lessthan",
                "time_lessthan_or_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Time since conversation was first assigned",
            "field": "casemetrics.firstassignmentat",
            "type": "TIME",
            "sub_type": "PAST",
            "group": "CASES",
            "rarity": "LESS_COMMON",
            "description": "Amount of time since the conversation was first assigned",
            "input_type": "TIME",
            "operators": [
                "time_greaterthan",
                "time_greaterthan_or_equalto",
                "time_lessthan",
                "time_lessthan_or_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Time since completed",
            "field": "cases.lastcompletedat",
            "type": "TIME",
            "sub_type": "PAST",
            "group": "CASES",
            "rarity": "LESS_COMMON",
            "description": "Amount of time since the conversation was completed",
            "input_type": "TIME",
            "operators": [
                "time_greaterthan",
                "time_greaterthan_or_equalto",
                "time_lessthan",
                "time_lessthan_or_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Time spent in current status",
            "field": "casemetrics.statusupdatedat",
            "type": "TIME",
            "sub_type": "PAST",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Amount of time the conversation has spent in its current status",
            "input_type": "TIME",
            "operators": [
                "time_greaterthan",
                "time_greaterthan_or_equalto",
                "time_lessthan",
                "time_lessthan_or_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Time to next breach",
            "field": "caseslametricevents.time_to_next_breach",
            "type": "TIME",
            "sub_type": "FUTURE",
            "group": "SLA",
            "rarity": "COMMON",
            "description": "Amount of time remaining until the conversation breaches any SLA target",
            "input_type": "TIME",
            "operators": [
                "time_greaterthan",
                "time_greaterthan_or_equalto",
                "time_lessthan",
                "time_lessthan_or_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Time since last breach",
            "field": "caseslametricevents.time_since_last_breach",
            "type": "TIME",
            "sub_type": "PAST",
            "group": "SLA",
            "rarity": "LESS_COMMON",
            "description": "Amount of time since the conversation has breached any SLA target",
            "input_type": "TIME",
            "operators": [
                "time_greaterthan",
                "time_greaterthan_or_equalto",
                "time_lessthan",
                "time_lessthan_or_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "First response time remaining",
            "field": "caseslametricevents.first_response_time_remaining",
            "type": "TIME",
            "sub_type": "FUTURE",
            "group": "SLA",
            "rarity": "LESS_COMMON",
            "description": "Amount of time remaining until the conversation breaches its first reply time target",
            "input_type": "TIME",
            "operators": [
                "time_greaterthan",
                "time_greaterthan_or_equalto",
                "time_lessthan",
                "time_lessthan_or_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Reply time remaining",
            "field": "caseslametricevents.reply_time_remaining",
            "type": "TIME",
            "sub_type": "FUTURE",
            "group": "SLA",
            "rarity": "LESS_COMMON",
            "description": "Amount of time remaining until the conversation breaches its resolution target",
            "input_type": "TIME",
            "operators": [
                "time_greaterthan",
                "time_greaterthan_or_equalto",
                "time_lessthan",
                "time_lessthan_or_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Resolution time remaining",
            "field": "caseslametricevents.resolution_time_remaining",
            "type": "TIME",
            "sub_type": "FUTURE",
            "group": "SLA",
            "rarity": "LESS_COMMON",
            "description": "Amount of time remaining until the conversation breaches its resolution target",
            "input_type": "TIME",
            "operators": [
                "time_greaterthan",
                "time_greaterthan_or_equalto",
                "time_lessthan",
                "time_lessthan_or_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "test",
            "field": "casefields.test",
            "type": "STRING",
            "sub_type": "",
            "group": "CASES",
            "rarity": "LESS_COMMON",
            "description": "",
            "input_type": "STRING",
            "operators": [
                "string_contains_insensitive",
                "string_does_not_contain_insensitive"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Your product url",
            "field": "casefields.your_product_url",
            "type": "STRING",
            "sub_type": "",
            "group": "CASES",
            "rarity": "LESS_COMMON",
            "description": "",
            "input_type": "STRING",
            "operators": [
                "string_contains_insensitive",
                "string_does_not_contain_insensitive"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "test",
            "field": "organizationfields.test",
            "type": "STRING",
            "sub_type": "",
            "group": "ORGANIZATION",
            "rarity": "LESS_COMMON",
            "description": "",
            "input_type": "STRING",
            "operators": [
                "string_contains_insensitive",
                "string_does_not_contain_insensitive"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Customer Success Manager",
            "field": "organizationfields.customer_success_manager",
            "type": "STRING",
            "sub_type": "",
            "group": "ORGANIZATION",
            "rarity": "LESS_COMMON",
            "description": "",
            "input_type": "STRING",
            "operators": [
                "string_contains_insensitive",
                "string_does_not_contain_insensitive"
            ],
            "values": null,
            "resource_type": "definition"
        }
    ],
    "resource": "definition",
    "total_count": 46
}
```




---

## Core / Insights


### Cases

Title: Cases - Insights | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/insights/cases/

Markdown Content:
# Cases - Insights | Kayako Developers

[![Image 1](https://developer.kayako.com/img/kayako-logo.png)](https://developer.kayako.com/)

*     
*   [Docs](https://developer.kayako.com/docs/single_sign_on/introduction/)
*   [API](https://developer.kayako.com/api/v1/reference/introduction/)
*   [SDK](https://developer.kayako.com/sdk/java/integration_guide/)
*   [Messenger![Image 2: beta](https://developer.kayako.com/img/new.png)](https://developer.kayako.com/messenger/home/)

*     
*   [Docs](https://developer.kayako.com/docs/single_sign_on/introduction/)
*   [API](https://developer.kayako.com/api/v1/reference/introduction/)
*   [SDK](https://developer.kayako.com/sdk/java/integration_guide/)
*   [Messenger![Image 3: beta](https://developer.kayako.com/img/new.png)](https://developer.kayako.com/messenger/home/)

Insights

*   [Reference](https://developer.kayako.com/api/v1/reference/introduction/)
Core*   [Users](https://developer.kayako.com/api/v1/users/activities/)
*   [Cases](https://developer.kayako.com/api/v1/cases/activities/)
*   [Insights](https://developer.kayako.com/api/v1/insights/cases/)
*   [Search](https://developer.kayako.com/api/v1/search/search/)
*   [Automation](https://developer.kayako.com/api/v1/automation/endpoints/)
Channels*   [Twitter](https://developer.kayako.com/api/v1/twitter/accounts/)
*   [Facebook](https://developer.kayako.com/api/v1/facebook/accounts/)
*   [Mail](https://developer.kayako.com/api/v1/mail/mailboxes/)
*   [Event](https://developer.kayako.com/api/v1/event/events/)
*   [Help Center](https://developer.kayako.com/api/v1/help_center/articles/)
Others*   [General](https://developer.kayako.com/api/v1/general/autocomplete/)

*   [Cases](https://developer.kayako.com/api/v1/insights/cases/)
    *   [CSAT](https://developer.kayako.com/api/v1/insights/cases/#CSAT)
        *   [Retrieve CSAT](https://developer.kayako.com/api/v1/insights/cases/#Csat__Retrieve-CSAT)

    *   [Channel](https://developer.kayako.com/api/v1/insights/cases/#Channel)
        *   [Retrieve Channel Statistics](https://developer.kayako.com/api/v1/insights/cases/#Channel__Retrieve-Channel-Statistics)

    *   [Average Resolution](https://developer.kayako.com/api/v1/insights/cases/#Average-Resolution)
        *   [Retrieve Average Resolution](https://developer.kayako.com/api/v1/insights/cases/#Resolution__Retrieve-Average-Resolution)

    *   [Average Response](https://developer.kayako.com/api/v1/insights/cases/#Average-Response)
        *   [Retrieve Average Response](https://developer.kayako.com/api/v1/insights/cases/#Response__Retrieve-Average-Response)

    *   [Case Completion](https://developer.kayako.com/api/v1/insights/cases/#Case-Completion)
        *   [Retrieve Case Completion](https://developer.kayako.com/api/v1/insights/cases/#Completion__Retrieve-Case-Completion)

    *   [Metrics](https://developer.kayako.com/api/v1/insights/cases/#Metrics)
        *   [Retrieve Metrics](https://developer.kayako.com/api/v1/insights/cases/#Metrics__Retrieve-Metrics)

*   [Help Center](https://developer.kayako.com/api/v1/insights/help_center/)
*   [Service Level Agreements](https://developer.kayako.com/api/v1/insights/service_level_agreements/)

1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   CORE
4.   INSIGHTS

# Cases

## Metadata

Version 1.0
Last Updated July 04, 2016

## Actions

## CSAT

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| start_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| end_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| previous_start_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| previous_end_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| interval | string |  | `DAY`, `WEEK`, `MONTH`, `QUARTER`, `YEAR` |
| interval_count | integer |  |  |
| series | [Series](https://developer.kayako.com/api/v1/insights/cases/#series) |  |  |
| metric | [Value](https://developer.kayako.com/api/v1/insights/cases/#value) |  |  |

## Series

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| data | array |  |  |
| previous | array |  |  |

## Value

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| value | integer |  |  |
| previous | integer |  |  |
| delta_percent | float |  |  |

## Retrieve CSAT

GET**/api/v1/insights/cases/csat.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[insights](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| start_at | string |  | Timestamp in format `YYYY-MM-DDThh:mm:ssTZD` |
| end_at | string |  | Timestamp in format `YYYY-MM-DDThh:mm:ssTZD` |
| previous_start_at | string |  | Timestamp in format `YYYY-MM-DDThh:mm:ssTZD` |
| previous_end_at | string |  | Timestamp in format `YYYY-MM-DDThh:mm:ssTZD` |
| interval | string |  | `DAY`, `WEEK`, `MONTH`, `QUARTER`, `YEAR` |
| agent_id | integer |  | If this argument is specified, only cases assigned to [Agent](https://developer.kayako.com/api/v1/users/users/) with id `agent_id` are considered. |
| team_id | integer |  | If this argument is specified, only cases assigned to [Team](https://developer.kayako.com/api/v1/users/teams/) with id `team_id` are considered. |
| source_channel | string |  | If this argument is specified, only cases created via specified channel are considered |

At a time, only one of the arguments from agent_id or team_id is allowed.

### Response

```text
{
    "status": 200,
    "data": {
        "start_at": "2016-04-16T00:00:00+00:00",
        "end_at": "2016-04-20T00:00:00+00:00",
        "previous_start_at": "2016-04-12T00:00:00+00:00",
        "previous_end_at": "2016-04-16T00:00:00+00:00",
        "interval": "DAY",
        "interval_count": 4,
        "series": {
            "name": "average_csat",
            "data": [
                1,
                3,
                5,
                1
            ],
            "previous": [
                1,
                3,
                5,
                2
            ],
            "resource_type": "report_series_comparison"
        },
        "metric": {
            "name": "average_csat",
            "value": 5,
            "previous": 7,
            "delta_percent": -28.571,
            "resource_type": "report_value_comparison"
        },
        "resource_type": "report_case_csat"
    }
}
```

## Channel

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| start_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| end_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| interval | string |  | `DAY`, `WEEK`, `MONTH`, `QUARTER`, `YEAR` |
| interval_count | integer |  |  |
| channel_series | array |  |  |

## Channel Statistics

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| channel | string |  |  |
| series | [Series](https://developer.kayako.com/api/v1/insights/cases/#series) |  |  |

## Retrieve Channel Statistics

GET**/api/v1/insights/cases/channel.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[insights](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| start_at | string |  | Timestamp in format `YYYY-MM-DDThh:mm:ssTZD` |
| end_at | string |  | Timestamp in format `YYYY-MM-DDThh:mm:ssTZD` |
| interval | string |  | `DAY`, `WEEK`, `MONTH`, `QUARTER`, `YEAR` |

### Response

```text
{
    "status": 200,
    "data": {
        "start_at": "2016-04-16T00:00:00+00:00",
        "end_at": "2016-04-20T00:00:00+00:00",
        "interval": "DAY",
        "interval_count": 4,
        "channel_series": [
            {
                "channel": "NOTE",
                "series": {
                    "name": "total_messages_received",
                    "data": [
                        1,
                        3,
                        5,
                        1
                    ],
                    "resource_type": "report_series"
                },
                "resource_type": "report_channel_statistics"
            },
            {
                "channel": "FACEBOOK",
                "series": {
                    "name": "total_messages_received",
                    "data": [
                        1,
                        3,
                        5,
                        1
                    ],
                    "resource_type": "report_series"
                },
                "resource_type": "report_channel_statistics"
            }
        ]
    },
    "resource_type": "report_case_channel"
}
```

## Average Resolution

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| start_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| end_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| previous_start_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| previous_end_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| interval | string |  | `DAY`, `WEEK`, `MONTH`, `QUARTER`, `YEAR` |
| interval_count | integer |  |  |
| series | [Series](https://developer.kayako.com/api/v1/insights/cases/#series) |  |  |
| metric | [Value](https://developer.kayako.com/api/v1/insights/cases/#value) |  |  |

## Retrieve Average Resolution

GET**/api/v1/insights/cases/resolution.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[insights](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| start_at | string |  | Timestamp in format `YYYY-MM-DDThh:mm:ssTZD` |
| end_at | string |  | Timestamp in format `YYYY-MM-DDThh:mm:ssTZD` |
| previous_start_at | string |  | Timestamp in format `YYYY-MM-DDThh:mm:ssTZD` |
| previous_end_at | string |  | Timestamp in format `YYYY-MM-DDThh:mm:ssTZD` |
| interval | string |  | `DAY`, `WEEK`, `MONTH`, `QUARTER`, `YEAR` |
| agent_id | integer |  | If this argument is specified, only cases assigned to [Agent](https://developer.kayako.com/api/v1/users/users/) with id `agent_id` are considered. |
| team_id | integer |  | If this argument is specified, only cases assigned to [Team](https://developer.kayako.com/api/v1/users/teams/) with id `team_id` are considered. |
| source_channel | string |  | If this argument is specified, only cases created via specified channel are considered |

At a time, only one of the arguments from agent_id or team_id is allowed.

### Response

```text
{
    "status": 200,
    "data": {
        "start_at": "2016-04-16T00:00:00+00:00",
        "end_at": "2016-04-20T00:00:00+00:00",
        "previous_start_at": "2016-04-12T00:00:00+00:00",
        "previous_end_at": "2016-04-16T00:00:00+00:00",
        "interval": "DAY",
        "interval_count": 4,
        "series": {
            "name": "average_resolution_time",
            "data": [
                1,
                3,
                5,
                1
            ],
            "previous": [
                1,
                3,
                4,
                1
            ],
            "resource_type": "report_series_comparison"
        },
        "metric": {
            "name": "average_resolution_time",
            "value": 5,
            "previous": 7,
            "delta_percent": -28.571,
            "resource_type": "report_value_comparison"
        },
        "resource_type": "report_average_resolution"
    }
}
```

## Average Response

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| start_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| end_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| previous_start_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| previous_end_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| interval | string |  | `DAY`, `WEEK`, `MONTH`, `QUARTER`, `YEAR` |
| interval_count | integer |  |  |
| series | [Series](https://developer.kayako.com/api/v1/insights/cases/#series) |  |  |
| metric | [Value](https://developer.kayako.com/api/v1/insights/cases/#value) |  |  |

## Retrieve Average Response

GET**/api/v1/insights/cases/response.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[insights](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| start_at | string |  | Timestamp in format `YYYY-MM-DDThh:mm:ssTZD` |
| end_at | string |  | Timestamp in format `YYYY-MM-DDThh:mm:ssTZD` |
| previous_start_at | string |  | Timestamp in format `YYYY-MM-DDThh:mm:ssTZD` |
| previous_end_at | string |  | Timestamp in format `YYYY-MM-DDThh:mm:ssTZD` |
| interval | string |  | `DAY`, `WEEK`, `MONTH`, `QUARTER`, `YEAR` |
| agent_id | integer |  | If this argument is specified, only cases assigned to [Agent](https://developer.kayako.com/api/v1/users/users/) with id `agent_id` are considered. |
| team_id | integer |  | If this argument is specified, only cases assigned to [Team](https://developer.kayako.com/api/v1/users/teams/) with id `team_id` are considered. |
| source_channel | string |  | If this argument is specified, only cases created via specified channel are considered |

At a time, only one of the arguments from agent_id or team_id is allowed.

### Response

```text
{
    "status": 200,
    "data": {
        "start_at": "2016-04-16T00:00:00+00:00",
        "end_at": "2016-04-20T00:00:00+00:00",
        "previous_start_at": "2016-04-12T00:00:00+00:00",
        "previous_end_at": "2016-04-16T00:00:00+00:00",
        "interval": "DAY",
        "interval_count": 4,
        "series": {
            "name": "average_response_time",
            "data": [
                1,
                3,
                5,
                1
            ],
            "previous": [
                1,
                3,
                4,
                1
            ],
            "resource_type": "report_series_comparison"
        },
        "metric": {
            "name": "average_response_time",
            "value": 5,
            "previous": 7,
            "delta_percent": -28.571,
            "resource_type": "report_value_comparison"
        },
        "resource_type": "report_average_response"
    }
}
```

## Case Completion

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| start_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| end_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| previous_start_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| previous_end_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| interval | string |  | `DAY`, `WEEK`, `MONTH`, `QUARTER`, `YEAR` |
| interval_count | integer |  |  |
| series | [Series](https://developer.kayako.com/api/v1/insights/cases/#series) |  |  |
| metric | [Value](https://developer.kayako.com/api/v1/insights/cases/#value) |  |  |

## Retrieve Case Completion

GET**/api/v1/insights/cases/completed.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[insights](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| start_at | string |  | Timestamp in format `YYYY-MM-DDThh:mm:ssTZD` |
| end_at | string |  | Timestamp in format `YYYY-MM-DDThh:mm:ssTZD` |
| previous_start_at | string |  | Timestamp in format `YYYY-MM-DDThh:mm:ssTZD` |
| previous_end_at | string |  | Timestamp in format `YYYY-MM-DDThh:mm:ssTZD` |
| interval | string |  | `DAY`, `WEEK`, `MONTH`, `QUARTER`, `YEAR` |
| agent_id | integer |  | If this argument is specified, only cases assigned to [Agent](https://developer.kayako.com/api/v1/users/users/) with id `agent_id` are considered. |
| team_id | integer |  | If this argument is specified, only cases assigned to [Team](https://developer.kayako.com/api/v1/users/teams/) with id `team_id` are considered. |
| source_channel | string |  | If this argument is specified, only cases created via specified channel are considered |

At a time, only one of the arguments from agent_id or team_id is allowed.

### Response

```text
{
    "status": 200,
    "data": {
        "start_at": "2016-04-16T00:00:00+00:00",
        "end_at": "2016-04-20T00:00:00+00:00",
        "previous_start_at": "2016-04-12T00:00:00+00:00",
        "previous_end_at": "2016-04-16T00:00:00+00:00",
        "interval": "DAY",
        "interval_count": 4,
        "series": {
            "name": "total_completed",
            "data": [
                1,
                3,
                5,
                1
            ],
            "previous": [
                1,
                3,
                5,
                2
            ],
            "resource_type": "report_series_comparison"
        },
        "metric": {
            "name": "total_completed",
            "value": 5,
            "previous": 7,
            "delta_percent": -28.571,
            "resource_type": "report_value_comparison"
        },
        "resource_type": "report_case_completion"
    }
}
```

## Metrics

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| start_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| end_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| previous_start_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| previous_end_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| metrics | array |  |  |

## Retrieve Metrics

GET**/api/v1/insights/cases/metrics.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[insights](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| start_at | string |  | Timestamp in format `YYYY-MM-DDThh:mm:ssTZD` |
| end_at | string |  | Timestamp in format `YYYY-MM-DDThh:mm:ssTZD` |
| previous_start_at | string |  | Timestamp in format `YYYY-MM-DDThh:mm:ssTZD` |
| previous_end_at | string |  | Timestamp in format `YYYY-MM-DDThh:mm:ssTZD` |
| agent_id | integer |  | If this argument is specified, only cases assigned to [Agent](https://developer.kayako.com/api/v1/users/users/) with id `agent_id` are considered. |
| team_id | integer |  | If this argument is specified, only cases assigned to [Team](https://developer.kayako.com/api/v1/users/teams/) with id `team_id` are considered. |
| source_channel | string |  | If this argument is specified, only cases created via specified channel are considered |

At a time, only one of the arguments from agent_id or team_id is allowed.

### Response

```text
{
    "status": 200,
    "data": {
        "start_at": "2016-04-16T00:00:00+00:00",
        "end_at": "2016-04-20T00:00:00+00:00",
        "previous_start_at": "2016-04-12T00:00:00+00:00",
        "previous_end_at": "2016-04-16T00:00:00+00:00",
        "metrics": [
            {
                "name": "total_assigned",
                "value": 5,
                "previous": 7,
                "delta_percent": -28.571,
                "resource_type": "report_value_comparison"
            },
            {
                "name": "total_created",
                "value": 5,
                "previous": 7,
                "delta_percent": -28.571,
                "resource_type": "report_value_comparison"
            },
            {
                "name": "customers_helped",
                "value": 5,
                "previous": 7,
                "delta_percent": -28.571,
                "resource_type": "report_value_comparison"
            },
            {
                "name": "cases_touched",
                "value": 5,
                "previous": 7,
                "delta_percent": -28.571,
                "resource_type": "report_value_comparison"
            },
            {
                "name": "total_public_replies",
                "value": 5,
                "previous": 7,
                "delta_percent": -28.571,
                "resource_type": "report_value_comparison"
            },
            {
                "name": "average_first_response_time",
                "value": 5,
                "previous": 7,
                "delta_percent": -28.571,
                "resource_type": "report_value_comparison"
            },
            {
                "name": "average_replies_to_resolution",
                "value": 5,
                "previous": 7,
                "delta_percent": -28.571,
                "resource_type": "report_value_comparison"
            },
            {
                "name": "percentage_first_contact_resolved",
                "value": 5,
                "previous": 7,
                "delta_percent": -28.571,
                "resource_type": "report_value_comparison"
            },
            {
                "name": "average_team_changes",
                "value": 5,
                "previous": 7,
                "delta_percent": -28.571,
                "resource_type": "report_value_comparison"
            },
            {
                "name": "average_assignee_changes",
                "value": 5,
                "previous": 7,
                "delta_percent": -28.571,
                "resource_type": "report_value_comparison"
            },
            {
                "name": "average_first_assignment_time",
                "value": 5,
                "previous": 7,
                "delta_percent": -28.571,
                "resource_type": "report_value_comparison"
            }
        ],
        "resource_type": "report_case_metrics"
    }
}
```

 Copyright © 2018 [Kayako](http://www.kayako.com/). All rights reserved • [Privacy Policy](http://www.kayako.com/about/privacy)

[](https://www.facebook.com/kayako/)[](https://twitter.com/kayako)




### Help Center

Title: Help Center - Insights | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/insights/help_center/

Published Time: Thu, 15 Feb 2018 07:35:46 GMT

Markdown Content:
*   [Docs](https://developer.kayako.com/docs/single_sign_on/introduction/)
*   [API](https://developer.kayako.com/api/v1/reference/introduction/)
*   [SDK](https://developer.kayako.com/sdk/java/integration_guide/)
*   [Messenger![Image 1: beta](https://developer.kayako.com/img/new.png)](https://developer.kayako.com/messenger/home/)

Insights

*   [Reference](https://developer.kayako.com/api/v1/reference/introduction/)
Core*   [Users](https://developer.kayako.com/api/v1/users/activities/)
*   [Cases](https://developer.kayako.com/api/v1/cases/activities/)
*   [Insights](https://developer.kayako.com/api/v1/insights/cases/)
*   [Search](https://developer.kayako.com/api/v1/search/search/)
*   [Automation](https://developer.kayako.com/api/v1/automation/endpoints/)
Channels*   [Twitter](https://developer.kayako.com/api/v1/twitter/accounts/)
*   [Facebook](https://developer.kayako.com/api/v1/facebook/accounts/)
*   [Mail](https://developer.kayako.com/api/v1/mail/mailboxes/)
*   [Event](https://developer.kayako.com/api/v1/event/events/)
*   [Help Center](https://developer.kayako.com/api/v1/help_center/articles/)
Others*   [General](https://developer.kayako.com/api/v1/general/autocomplete/)

*   [Cases](https://developer.kayako.com/api/v1/insights/cases/)
*   [Help Center](https://developer.kayako.com/api/v1/insights/help_center/)
    *   [Search](https://developer.kayako.com/api/v1/insights/help_center/#Search)
        *   [Retrieve Search Statistics](https://developer.kayako.com/api/v1/insights/help_center/#Search__Retrieve-Search-Statistics)

    *   [Articles](https://developer.kayako.com/api/v1/insights/help_center/#Articles)
        *   [Retrieve Article Statistics](https://developer.kayako.com/api/v1/insights/help_center/#Article__Retrieve-Article-Statistics)

*   [Service Level Agreements](https://developer.kayako.com/api/v1/insights/service_level_agreements/)

1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   CORE
4.   INSIGHTS

## Search

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| start_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| end_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| popular_searches | array |  | Top 10 popular searches |
| failed_searches | array |  | Top 10 failed searches |

## Retrieve Search Statistics

GET**/api/v1/insights/helpcenter/search.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[insights](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| start_at | string |  | Timestamp in format `YYYY-MM-DDThh:mm:ssTZD` |
| end_at | string |  | Timestamp in format `YYYY-MM-DDThh:mm:ssTZD` |

### Response

```
{
    "status": 200,
    "data": {
        "start_at": "2016-04-16T00:00:00+00:00",
        "end_at": "2016-04-16T00:00:00+00:00",
        "popular_searches": [
            {
                "name": "Brewing",
                "average_result_count": 10,
                "attempt_count": 5,
                "last_attempted_at": "2016-04-16T00:00:00+00:00",
                "resource_type": "report_helpcenter_query"
            },
            {
                "name": "Coffee",
                "average_result_count": 8,
                "attempt_count": 2,
                "last_attempted_at": "2016-04-16T00:00:00+00:00",
                "resource_type": "report_helpcenter_query"
            }
        ],
        "failed_searches": [
            {
                "name": "tip",
                "average_result_count": 0,
                "attempt_count": 5,
                "last_attempted_at": "2016-04-16T00:00:00+00:00",
                "resource_type": "report_helpcenter_query"
            },
            {
                "name": "Siphon",
                "average_result_count": 0,
                "attempt_count": 2,
                "last_attempted_at": "2016-04-16T00:00:00+00:00",
                "resource_type": "report_helpcenter_query"
            }
        ],
        "resource_type": "report_helpcenter_search"
    }
}
```

## Retrieve Article Statistics

GET**/api/v1/insights/helpcenter/articles.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[insights](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "legacy_id": null,
            "uuid": "44afa976-5041-57d2-820e-55ab43c4c6b9",
            "titles": [
                {
                    "id": 1,
                    "resource_type": "locale_field"
                }
            ],
            "slugs": [
                {
                    "locale": "en-us",
                    "translation": "1-v60-pour-over-brewing",
                    "resource_type": "slug"
                }
            ],
            "contents": [
                {
                    "id": 1,
                    "resource_type": "locale_field"
                }
            ],
            "keywords": null,
            "section": {
                "id": 1,
                "resource_type": "section"
            },
            "creator": {
                "id": 1,
                "resource_type": "user_minimal"
            },
            "author": {
                "id": 1,
                "resource_type": "user_minimal"
            },
            "attachments": [],
            "download_all": null,
            "status": "PUBLISHED",
            "upvote_count": 0,
            "downvote_count": 0,
            "views": 0,
            "rank": 0,
            "tags": [],
            "is_featured": true,
            "allow_comments": true,
            "total_comments": 0,
            "created_at": "2016-04-13T07:32:51+00:00",
            "published_at": "2016-04-13T07:32:51+00:00",
            "updated_at": "2016-04-13T07:32:51+00:00",
            "helpcenter_url": "https://brewfictus.kayako.com/article/1",
            "resource_type": "article",
            "resource_url": "https://brewfictus.kayako.com/api/v1/articles/1"
        }
    ],
    "resource_type": "article",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```




### Service Level Agreements

Title: Service Level Agreements - Insights

URL Source: https://developer.kayako.com/api/v1/insights/service_level_agreements/

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   CORE
4.   INSIGHTS

## Overview

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| start_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| end_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| previous_start_at | string |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| previous_end_at | string |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| cases | array |  |  |

## Conversation SLA Statistics

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| case | Case Pointer |  |  |
| resolution_due_at | string |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| age | integer |  | Age of the conversation in days |
| is_breached | boolean |  |  |
| effort_score | integer |  |  |

## Series

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| data | array |  |  |
| previous | array |  |  |

## Value

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| value | integer |  |  |
| previous | integer |  |  |
| delta_percent | float |  |  |

## Retrieve Overview

GET**/api/v1/insights/sla/overview.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[insights](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| start_at | string |  | Timestamp in format `YYYY-MM-DDThh:mm:ssTZD` |
| end_at | string |  | Timestamp in format `YYYY-MM-DDThh:mm:ssTZD` |
| agent_id | integer |  | If this argument is specified, only conversations assigned to [Agent](https://developer.kayako.com/api/v1/users/users/) with id `agent_id` are considered. |
| team_id | integer |  | If this argument is specified, only conversations assigned to [Team](https://developer.kayako.com/api/v1/users/teams/) with id `team_id` are considered. |

At a time, only one of the arguments from agent_id or team_id is allowed.

### Response

```
{
    "status": 200,
    "data": {
        "start_at": "2016-04-16T00:00:00+00:00",
        "end_at": "2016-04-20T00:00:00+00:00",
        "cases": [
            {
                "case": {
                    "id": 1,
                    "resource_type": "case_pointer",
                    "resource_url": "https://brewfictus.kayako.com/api/v1/case/1"
                },
                "is_breached": true,
                "resolution_due_at": "2016-04-17T23:12:12+00:00",
                "age": 5,
                "effort_score": 6,
                "resource_type": "report_case_sla"
            },
            {
                "case": {
                    "id": 2,
                    "resource_type": "case_pointer",
                    "resource_url": "https://brewfictus.kayako.com/api/v1/case/2"
                },
                "is_breached": false,
                "resolution_due_at": "2016-04-17T23:12:12+00:00",
                "age": 5,
                "effort_score": 7,
                "resource_type": "report_case_sla"
            }
        ]
    },
    "resource_type": "report_sla_overview"
}
```

## Target

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| start_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| end_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| previous_start_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| previous_end_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| targets | array |  |  |

## Target Statistics

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| sla_target | [SLA](https://developer.kayako.com/api/v1/cases/service_level_agreements/) |  |  |
| metrics | array |  |  |

## Retrieve Target

GET**/api/v1/insights/sla/target.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[insights](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| start_at | string |  | Timestamp in format `YYYY-MM-DDThh:mm:ssTZD` |
| end_at | string |  | Timestamp in format `YYYY-MM-DDThh:mm:ssTZD` |
| previous_start_at | string |  | Timestamp in format `YYYY-MM-DDThh:mm:ssTZD` |
| previous_end_at | string |  | Timestamp in format `YYYY-MM-DDThh:mm:ssTZD` |
| agent_id | integer |  | If this argument is specified, only cases assigned to [Agent](https://developer.kayako.com/api/v1/users/users/) with id `agent_id` are considered. |
| team_id | integer |  | If this argument is specified, only cases assigned to [Team](https://developer.kayako.com/api/v1/users/teams/) with id `team_id` are considered. |
| source_channel | string |  | If this argument is specified, only cases created via specified channel are considered |

At a time, only one of the arguments from agent_id or team_id is allowed.

### Response

```
{
    "status": 200,
    "data": {
        "start_at": "2016-04-16T00:00:00+00:00",
        "end_at": "2016-04-20T00:00:00+00:00",
        "previous_start_at": "2016-04-12T00:00:00+00:00",
        "previous_end_at": "2016-04-16T00:00:00+00:00",
        "targets": [
            {
                "sla_target": {
                    "id": 10,
                    "resource_type": "sla_target"
                },
                "metrics": [
                    {
                        "name": "percentage_achieved",
                        "value": 5,
                        "previous": 7,
                        "delta_percent": -28.571,
                        "resource_type": "report_value_comparison"
                    },
                    {
                        "name": "total_breached",
                        "value": 5,
                        "previous": 7,
                        "delta_percent": -28.571,
                        "resource_type": "report_value_comparison"
                    },
                    {
                        "name": "average_time_to_target",
                        "value": 5,
                        "previous": 7,
                        "delta_percent": -28.571,
                        "resource_type": "report_value_comparison"
                    },
                    {
                        "name": "average_time_overdue_to_breach",
                        "value": 5,
                        "previous": 7,
                        "delta_percent": -28.571,
                        "resource_type": "report_value_comparison"
                    }
                ],
                "resource_type": "report_sla_target"
            }
        ]
    },
    "resource_type": "report_sla_target"
}
```

## Performance

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| start_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| end_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| previous_start_at | string |  | Timestamp in format `YYYY-MM-DDThh:mm:ssTZD` |
| previous_end_at | string |  | Timestamp in format `YYYY-MM-DDThh:mm:ssTZD` |
| interval | string |  | `DAY`, `WEEK`, `MONTH`, `QUARTER`, `YEAR` |
| interval_count | integer |  |  |
| performance_series | [Performance](https://developer.kayako.com/api/v1/insights/service_level_agreements/#Performance) |  |  |

## Performance Statistics

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| sla | [SLA](https://developer.kayako.com/api/v1/cases/service_level_agreements/) |  |  |
| series | [Series](https://developer.kayako.com/api/v1/insights/service_level_agreements/#series) |  |  |

## Retrieve Performance

GET**/api/v1/insights/sla/performance.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[insights](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| start_at | string |  | Timestamp in format `YYYY-MM-DDThh:mm:ssTZD` |
| end_at | string |  | Timestamp in format `YYYY-MM-DDThh:mm:ssTZD` |
| previous_start_at | string |  | Timestamp in format `YYYY-MM-DDThh:mm:ssTZD` |
| previous_end_at | string |  | Timestamp in format `YYYY-MM-DDThh:mm:ssTZD` |
| interval | string |  | `DAY`, `WEEK`, `MONTH`, `QUARTER`, `YEAR` |
| agent_id | integer |  | If this argument is specified, only conversations assigned to [Agent](https://developer.kayako.com/api/v1/users/users/) with id `agent_id` are considered. |
| team_id | integer |  | If this argument is specified, only conversations assigned to [Team](https://developer.kayako.com/api/v1/users/teams/) with id `team_id` are considered. |
| source_channel | string |  | If this argument is specified, only conversations created via specified channel are considered |

At a time, only one of the arguments from agent_id or team_id is allowed.

### Response

```
{
    "status": 200,
    "data": {
        "start_at": "2016-04-16T00:00:00+00:00",
        "end_at": "2016-04-20T00:00:00+00:00",
        "previous_start_at": "2016-04-12T00:00:00+00:00",
        "previous_end_at": "2016-04-16T00:00:00+00:00",
        "interval": "DAY",
        "interval_count": 4,
        "performance_series": [
            {
                "sla": {
                    "id": 2,
                    "resource_type": "sla"
                },
                "series": {
                    "name": "percentage_achieved",
                    "data": [
                        1,
                        3,
                        5,
                        1
                    ],
                    "previous": [
                        1,
                        3,
                        5,
                        2
                    ],
                    "resource_type": "report_series_comparison"
                },
                "resource_type": "report_performance_series"
            }
        ]
    },
    "resource_type": "report_sla_performance"
}
```




---

## Core / Search


### Search

Title: Search - Search | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/search/search/

Markdown Content:
```
{
    "status": 200,
    "data": [
        {
            "id": 13,
            "title": "John Doe",
            "snippet": " <em>John</em> Doe",
            "relevance": 0.1401102,
            "created_at": "2010-07-19T15:44:35+05:00",
            "resource": "user",
            "resource_url": "https://brewfictus.kayako.com/api/v1/users/13"
        },
        {
            "id": 19,
            "title": "John Mathew",
            "snippet": " <em>John</em> Mathew",
            "relevance": 0.1401102,
            "created_at": "2010-07-19T15:44:35+05:00",
            "resource": "user",
            "resource_url": "https://brewfictus.kayako.com/api/v1/users/19"
        }
    ],
    "resource": "result",
    "total_count": 2
}
```

```
{
    "status": 200,
    "data": [
        {
            "id": 13,
            "title": "John Doe",
            "snippet": " <em>John</em> Doe",
            "relevance": 0.1401102,
            "created_at": "2010-07-19T15:44:35+05:00",
            "resource": "user",
            "resource_url": "https://brewfictus.kayako.com/api/v1/users/13"
        },
        {
            "id": 19,
            "title": "John Mathew",
            "snippet": " <em>John</em> Mathew",
            "relevance": 0.1401102,
            "created_at": "2010-07-19T15:44:35+05:00",
            "resource": "user",
            "resource_url": "https://brewfictus.kayako.com/api/v1/users/19"
        }
    ],
    "resource": "result",
    "offset": 0,
    "limit": 30,
    "total_count": 2
}
```

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "title": "Simon Blackhouse",
            "data": {
                "id": 1,
                "uuid": "11b60c25-c44c-47b8-9f48-56631cd7fa01",
                "full_name": "Simon Blackhouse",
                "legacy_id": null,
                "designation": "Community Manager",
                "is_enabled": true,
                "is_mfa_enabled": true,
                "role": {
                    "id": 2,
                    "resource_type": "role"
                },
                "avatar": "https://brewfictus.kayako.com/avatar/get/24ee2d81-ad95-5ae1-a07e-7ccedcdb70b8",
                "agent_case_access": "ALL",
                "organization_case_access": null,
                "organization": {
                    "id": 1,
                    "resource_type": "organization"
                },
                "teams": [],
                "emails": [
                    {
                        "id": 1,
                        "resource_type": "identity_email"
                    }
                ],
                "phones": [
                    {
                        "id": 1,
                        "resource_type": "identity_phone"
                    }
                ],
                "twitter": [],
                "facebook": [],
                "external_identifiers": [],
                "addresses": [
                    {
                        "id": 1,
                        "resource_type": "contact_address"
                    }
                ],
                "websites": [
                    {
                        "id": 1,
                        "resource_type": "contact_website"
                    }
                ],
                "custom_fields": [
                    {
                        "field": {
                            "id": 1,
                            "resource_type": "user_field"
                        },
                        "value": "Customer Success",
                        "resource_type": "user_field_value"
                    }
                ],
                "pinned_notes_count": 0,
                "locale": "en-us",
                "time_zone": null,
                "time_zone_offset": null,
                "greeting": null,
                "signature": null,
                "status_message": null,
                "last_seen_user_agent": null,
                "last_seen_ip": null,
                "last_seen_at": null,
                "last_active_at": null,
                "realtime_channel": "presence-0c1c9535b26b749f815a22cb459a4a8084be77b6ac9515751ef5a743b190bef3@v1_users_6",
                "presence_channel": "user_presence-281f395f6f51d031a6d3db3489906c98285191ebac41bb744f9323f61af63433@5c98cdaa58dd91ff1119a476e8b3e305d2906d3b",
                "password_updated_at": "2016-03-15T10:38:01+05:00",
                "avatar_updated_at": null,
                "last_logged_in_at": null,
                "last_activity_at": null,
                "created_at": "2016-03-15T10:38:01+05:00",
                "updated_at": "2016-03-15T10:38:01+05:00",
                "resource_type": "user",
                "resource_url": "https://brewfictus.kayako.com/api/v1/users/1"
            },
            "snippet": "<em>Simon</em> Blackhouse",
            "relevance": 0.5237101,
            "created_at": "2010-07-19T15:44:35+05:00",
            "resource": "user",
            "resource_url": "https://brewfictus.kayako.com/api/v1/users/1"
        }
    ],
    "resource": "result",
    "total_count": 1
}
```




---

## Core / Automation


### Endpoints

Title: Endpoints - Automation | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/automation/endpoints/

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   CORE
4.   AUTOMATION

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| title | string |  |  |
| type | string |  | `EMAIL`, `HTTP`, `SLACK` |
| attributes | [Attributes](https://developer.kayako.com/api/v1/automation/endpoints/#attributes) |  |  |
| is_enabled | boolean |  |  |
| last_attempt_result | string |  | `SUCCESS`, `FAILURE` |
| last_attempt_message | string |  |  |
| last_attempt_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Attributes

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| value | string |  |  |

## Retrieve all endpoints

GET**/api/v1/endpoints.json**

### Information

Allowed for Admins & Owners
Scope[configuration](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)
Ordered by id (descending)

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "title": "Case update notifications",
            "type": "EMAIL",
            "attributes": [
                {
                    "name": "address",
                    "value": "support@brewfictus.com",
                    "resource_type": "endpoint_attribute"
                },
                {
                    "name": "subject",
                    "value": "Case has been updated",
                    "resource_type": "endpoint_attribute"
                }
            ],
            "is_enabled": true,
            "last_attempt_result": "SUCCESS",
            "last_attempt_message": null,
            "last_attempt_at": "2016-02-10T08:42:03+05:00",
            "resource_type": "endpoint",
            "resource_url": "https://brewfictus.kayako.com/api/v1/endpoints/1"
        }
    ],
    "resource": "endpoint",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Retrieve an endpoint

GET**/api/v1/endpoints/:id.json**

### Information

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "title": "Case update notifications",
        "type": "EMAIL",
        "attributes": [
            {
                "name": "address",
                "value": "support@brewfictus.com",
                "resource_type": "endpoint_attribute"
            },
            {
                "name": "subject",
                "value": "Case has been updated",
                "resource_type": "endpoint_attribute"
            }
        ],
        "is_enabled": true,
        "last_attempt_result": "SUCCESS",
        "last_attempt_message": null,
        "last_attempt_at": "2016-02-10T08:42:03+05:00",
        "resource_type": "endpoint",
        "resource_url": "https://brewfictus.kayako.com/api/v1/endpoints/1"
    },
    "resource": "endpoint"
}
```

## Add an endpoint

POST**/api/v1/endpoints.json**

### Information

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| title | string |  |  |
| type | string |  | `EMAIL`, `HTTP`, `SLACK` |
| attributes | string |  | **Example for _type_ EMAIL:** _address_ and _subject_ are mandatory `{"address":"support@brewfictus.com", "subject":"Conversation has been updated"}` **Example for _type_ HTTP:** _url_, _method_, _content\_type_ and _use\_auth_ are mandatory _auth\_username_ is mandatory if _use\_auth_ set to `true` _auth\_password_ is mandatory if _use\_auth_ set to `true` Allowed _method_ are `GET`, `POST`, `PUT`, `PATCH`, `DELETE` Allowed _content\_type_ are `FORM`, `XML`, `JSON` _content\_type_ is mandatory for `POST`, `PUT` and `PATCH` method `{"url":"https://mydesk.kayako.com/incoming", "method":"POST", "use_auth":false, "auth_username":"", "auth_password":"", "content_type":"FORM"}` **Note:** For _url_, HTTP 2xx response codes are considered successful. **Example for _type_ SLACK:** _webhook\_url_ is mandatory `{"webhook_url":"https://hooks.slack.com/services/T000/B000/XXXX", "channel":"engineering"}` |
| is_enabled | boolean |  | **Default:**`true` |

### Response

```
{
    "status": 201,
    "data": {
        "id": 1,
        "title": "Case update notifications",
        "type": "EMAIL",
        "attributes": [
            {
                "name": "address",
                "value": "support@brewfictus.com",
                "resource_type": "endpoint_attribute"
            },
            {
                "name": "subject",
                "value": "Case has been updated",
                "resource_type": "endpoint_attribute"
            }
        ],
        "is_enabled": true,
        "last_attempt_result": "SUCCESS",
        "last_attempt_message": null,
        "last_attempt_at": "2016-02-10T08:42:03+05:00",
        "resource_type": "endpoint",
        "resource_url": "https://brewfictus.kayako.com/api/v1/endpoints/1"
    },
    "resource": "endpoint"
}
```

## Update an endpoint

PUT**/api/v1/endpoints.json**

### Information

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| title | string |  |  |
| attributes | string |  | **Example for _type_ EMAIL:** _address_ and _subject_ are mandatory `{"address":"support@brewfictus.com", "subject":"Conversation has been updated"}` **Example for _type_ HTTP:** _url_, _method_, _content\_type_ and _use\_auth_ are mandatory _auth\_username_ is mandatory if _use\_auth_ set to `true` _auth\_password_ is mandatory if _use\_auth_ set to `true` Allowed _method_ are `GET`, `POST`, `PUT`, `PATCH`, `DELETE` Allowed _content\_type_ are `FORM`, `XML`, `JSON` `{"url":"https://mydesk.kayako.com/incoming", "method":"POST", "content_type":"FORM", "use_auth":false, "auth_username":"", "auth_password":""}` **Note:** For _url_, HTTP 2xx response codes are considered successful. **Example for _type_ SLACK:** _webhook\_url_ is mandatory `{"webhook_url":"https://hooks.slack.com/services/T000/B000/XXXX", "channel":"engineering"}` |
| is_enabled | boolean |  |  |

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "title": "Case update notifications",
        "type": "EMAIL",
        "attributes": [
            {
                "name": "address",
                "value": "support@brewfictus.com",
                "resource_type": "endpoint_attribute"
            },
            {
                "name": "subject",
                "value": "Case has been updated",
                "resource_type": "endpoint_attribute"
            }
        ],
        "is_enabled": true,
        "last_attempt_result": "SUCCESS",
        "last_attempt_message": null,
        "last_attempt_at": "2016-02-10T08:42:03+05:00",
        "resource_type": "endpoint",
        "resource_url": "https://brewfictus.kayako.com/api/v1/endpoints/1"
    },
    "resource": "endpoint"
}
```

## Delete an endpoint

DELETE**/api/v1/endpoints/:id.json**

### Information

### Response

```
{
    "status": 200
}
```

## Delete endpoints

DELETE**/api/v1/endpoints.json**

### Information

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```




### Monitors

Title: Monitors - Automation | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/automation/monitors/

Markdown Content:
```
{
    "status": 200,
    "data": [
        {
            "label": "Subject",
            "field": "cases.subject",
            "type": "STRING",
            "sub_type": "",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Conversation's subject",
            "input_type": "STRING",
            "operators": [
                "string_contains_insensitive",
                "string_does_not_contain_insensitive"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Status",
            "field": "cases.casestatusid",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Status of conversation",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "1": "New",
                "2": "Open",
                "3": "Pending",
                "4": "Completed"
            },
            "resource_type": "definition"
        },
        {
            "label": "Priority",
            "field": "cases.casepriorityid",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Priority of conversation",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto",
                "comparison_lessthan",
                "comparison_greaterthan"
            ],
            "values": {
                "0": "none",
                "1": "Low",
                "2": "Normal",
                "3": "High",
                "4": "Urgent"
            },
            "resource_type": "definition"
        },
        {
            "label": "Type",
            "field": "cases.casetypeid",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Conversation type",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "0": "none",
                "1": "Question",
                "2": "Task",
                "3": "Problem",
                "4": "Incident"
            },
            "resource_type": "definition"
        },
        {
            "label": "Team",
            "field": "cases.assigneeteamid",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Team assigned to conversation",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "0": "(Unassigned)",
                "1": "General"
            },
            "resource_type": "definition"
        },
        {
            "label": "Assignee",
            "field": "cases.assigneeagentid",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Agent assigned to conversation",
            "input_type": "AUTOCOMPLETE",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "0": "(Unassigned)",
                "(requester)": "(Requester)"
            },
            "resource_type": "definition"
        },
        {
            "label": "Requester",
            "field": "cases.requesterid",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Requester of the conversation",
            "input_type": "AUTOCOMPLETE",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "(assignee)": "(Assignee)"
            },
            "resource_type": "definition"
        },
        {
            "label": "Organization",
            "field": "users.organizationid",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Requester's organization",
            "input_type": "AUTOCOMPLETE",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Tags",
            "field": "tags.name",
            "type": "COLLECTION",
            "sub_type": "",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Tags added to conversation",
            "input_type": "TAGS",
            "operators": [
                "collection_contains_insensitive",
                "collection_contains_any_insensitive",
                "collection_does_not_contain_insensitive"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Brand",
            "field": "cases.brandid",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Brand to which conversation belongs",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "1": "Brewfictus"
            },
            "resource_type": "definition"
        },
        {
            "label": "Source Channel",
            "field": "cases.channel",
            "type": "STRING",
            "sub_type": "",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Channel over which the conversation was started",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "MAIL": "Mail",
                "MESSENGER": "Messenger",
                "FACEBOOK": "Facebook",
                "TWITTER": "Twitter",
                "NOTE": "Note",
                "HELPCENTER": "Helpcenter"
            },
            "resource_type": "definition"
        },
        {
            "label": "Satisfaction status",
            "field": "cases.satisfactionstatus",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "SATISFACTION",
            "rarity": "COMMON",
            "description": "The status of satisfaction offering for the conversation",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "1": "UNOFFERED",
                "2": "OFFERED",
                "3": "RECEIVED"
            },
            "resource_type": "definition"
        },
        {
            "label": "Satisfaction rating",
            "field": "cases.rating",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "SATISFACTION",
            "rarity": "COMMON",
            "description": "Satisfaction rating for the conversation",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "0": "Not set",
                "1": "Good",
                "-1": "Bad"
            },
            "resource_type": "definition"
        },
        {
            "label": "SLA",
            "field": "cases.slaversionid",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "SLA",
            "rarity": "COMMON",
            "description": "SLA that's applied to the conversation",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "0": "none",
                "1": "VIP Customer"
            },
            "resource_type": "definition"
        },
        {
            "label": "SLA breached",
            "field": "cases.isslabreached",
            "type": "BOOLEAN",
            "sub_type": "",
            "group": "SLA",
            "rarity": "COMMON",
            "description": "Whether or not the conversation has breached any of its SLA targets",
            "input_type": "BOOLEAN_TRUE",
            "operators": [
                "comparison_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Number of reopens",
            "field": "casemetrics.reopencount",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "LESS_COMMON",
            "description": "Number of times conversation has been reopened",
            "input_type": "INTEGER",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto",
                "comparison_greaterthan",
                "comparison_greaterthan_or_equalto",
                "comparison_lessthan",
                "comparison_lessthan_or_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Number of agent replies",
            "field": "casemetrics.agentreplycount",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "LESS_COMMON",
            "description": "Number of agent replies on conversation",
            "input_type": "INTEGER",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto",
                "comparison_greaterthan",
                "comparison_greaterthan_or_equalto",
                "comparison_lessthan",
                "comparison_lessthan_or_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Number of requester replies",
            "field": "casemetrics.requesterreplycount",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "LESS_COMMON",
            "description": "Number of times requester has replied",
            "input_type": "INTEGER",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto",
                "comparison_greaterthan",
                "comparison_greaterthan_or_equalto",
                "comparison_lessthan",
                "comparison_lessthan_or_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Number of replies",
            "field": "casemetrics.replycount",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "LESS_COMMON",
            "description": "Number of total replies on a conversation",
            "input_type": "INTEGER",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto",
                "comparison_greaterthan",
                "comparison_greaterthan_or_equalto",
                "comparison_lessthan",
                "comparison_lessthan_or_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Number of agent reassignments",
            "field": "casemetrics.assigneechangecount",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "LESS_COMMON",
            "description": "Number of times assignee has been changed",
            "input_type": "INTEGER",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto",
                "comparison_greaterthan",
                "comparison_greaterthan_or_equalto",
                "comparison_lessthan",
                "comparison_lessthan_or_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Number of team reassignments",
            "field": "casemetrics.teamchangecount",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "LESS_COMMON",
            "description": "Number of times team has been changed",
            "input_type": "INTEGER",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto",
                "comparison_greaterthan",
                "comparison_greaterthan_or_equalto",
                "comparison_lessthan",
                "comparison_lessthan_or_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Last update by user",
            "field": "cases.lastupdatedby",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "LESS_COMMON",
            "description": "User who made the last update",
            "input_type": "AUTOCOMPLETE",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "(assignee)": "(Assignee)",
                "(requester)": "(Requester)"
            },
            "resource_type": "definition"
        },
        {
            "label": "Last update by user role",
            "field": "roles.type",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "LESS_COMMON",
            "description": "Role of the user who made the last update",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "1": "Owner",
                "2": "Admin",
                "3": "Agent",
                "4": "Collaborator",
                "5": "Customer"
            },
            "resource_type": "definition"
        },
        {
            "label": "Language",
            "field": "users.languageid",
            "type": "STRING",
            "sub_type": "",
            "group": "REQUESTER",
            "rarity": "LESS_COMMON",
            "description": "Requester's language",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "2": "en-us"
            },
            "resource_type": "definition"
        },
        {
            "label": "Timezone",
            "field": "users.timezone",
            "type": "STRING",
            "sub_type": "",
            "group": "REQUESTER",
            "rarity": "LESS_COMMON",
            "description": "Requester's timezone",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "Africa/Abidjan": "Africa/Abidjan",
                "Africa/Accra": "Africa/Accra",
                "UTC": "UTC"
            },
            "resource_type": "definition"
        },
        {
            "label": "Tags",
            "field": "requester.tags",
            "type": "COLLECTION",
            "sub_type": "",
            "group": "REQUESTER",
            "rarity": "COMMON",
            "description": "Tags that have been added to the organization's profile",
            "input_type": "TAGS",
            "operators": [
                "collection_contains_insensitive",
                "collection_contains_any_insensitive",
                "collection_does_not_contain_insensitive"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Tags",
            "field": "organization.tags",
            "type": "COLLECTION",
            "sub_type": "",
            "group": "ORGANIZATION",
            "rarity": "COMMON",
            "description": "Tags that have been added to the organization's profile",
            "input_type": "TAGS",
            "operators": [
                "collection_contains_insensitive",
                "collection_contains_any_insensitive",
                "collection_does_not_contain_insensitive"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Form",
            "field": "cases.caseformid",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Form linked to conversation",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "0": "none",
                "1": "Default"
            },
            "resource_type": "definition"
        },
        {
            "label": "Time since conversation created",
            "field": "cases.createdat",
            "type": "TIME",
            "sub_type": "PAST",
            "group": "CASES",
            "rarity": "LESS_COMMON",
            "description": "Amount of time since the conversation was created",
            "input_type": "TIME",
            "operators": [
                "time_greaterthan",
                "time_greaterthan_businesshours",
                "time_greaterthan_or_equalto",
                "time_greaterthan_or_equalto_businesshours",
                "time_lessthan",
                "time_lessthan_businesshours",
                "time_lessthan_or_equalto",
                "time_lessthan_or_equalto_businesshours"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Time since last update",
            "field": "cases.updatedat",
            "type": "TIME",
            "sub_type": "PAST",
            "group": "CASES",
            "rarity": "LESS_COMMON",
            "description": "Amount of time since the last update to the conversation",
            "input_type": "TIME",
            "operators": [
                "time_greaterthan",
                "time_greaterthan_businesshours",
                "time_greaterthan_or_equalto",
                "time_greaterthan_or_equalto_businesshours",
                "time_lessthan",
                "time_lessthan_businesshours",
                "time_lessthan_or_equalto",
                "time_lessthan_or_equalto_businesshours"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Role",
            "field": "requester.roletype",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "REQUESTER",
            "rarity": "LESS_COMMON",
            "description": "Requester's role",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "1": "Owner",
                "2": "Admin",
                "3": "Agent",
                "4": "Collaborator",
                "5": "Customer"
            },
            "resource_type": "definition"
        },
        {
            "label": "Primary email",
            "field": "identityemails.address",
            "type": "STRING",
            "sub_type": "",
            "group": "REQUESTER",
            "rarity": "LESS_COMMON",
            "description": "Requester's primary email address",
            "input_type": "STRING",
            "operators": [
                "string_contains_insensitive",
                "string_does_not_contain_insensitive"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Number of Twitter followers",
            "field": "identitytwitter.followercount",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "REQUESTER",
            "rarity": "LESS_COMMON",
            "description": "Number of followers on the requester's twitter account",
            "input_type": "INTEGER",
            "operators": [
                "comparison_equalto",
                "comparison_greaterthan",
                "comparison_lessthan"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Twitter account verified",
            "field": "identitytwitter.isverified",
            "type": "BOOLEAN",
            "sub_type": "",
            "group": "REQUESTER",
            "rarity": "LESS_COMMON",
            "description": "Whether the requester's Twitter account is verified",
            "input_type": "BOOLEAN_TRUE",
            "operators": [
                "comparison_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "test",
            "field": "casefields.test",
            "type": "STRING",
            "sub_type": "",
            "group": "CASES",
            "rarity": "LESS_COMMON",
            "description": "",
            "input_type": "STRING",
            "operators": [
                "string_contains_insensitive",
                "string_does_not_contain_insensitive"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Your product url",
            "field": "casefields.your_product_url",
            "type": "STRING",
            "sub_type": "",
            "group": "CASES",
            "rarity": "LESS_COMMON",
            "description": "",
            "input_type": "STRING",
            "operators": [
                "string_contains_insensitive",
                "string_does_not_contain_insensitive"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "test",
            "field": "organizationfields.test",
            "type": "STRING",
            "sub_type": "",
            "group": "ORGANIZATION",
            "rarity": "LESS_COMMON",
            "description": "",
            "input_type": "STRING",
            "operators": [
                "string_contains_insensitive",
                "string_does_not_contain_insensitive"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Customer Success Manager",
            "field": "organizationfields.customer_success_manager",
            "type": "STRING",
            "sub_type": "",
            "group": "ORGANIZATION",
            "rarity": "LESS_COMMON",
            "description": "",
            "input_type": "STRING",
            "operators": [
                "string_contains_insensitive",
                "string_does_not_contain_insensitive"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Time since conversation was first assigned",
            "field": "casemetrics.firstassignmentat",
            "type": "TIME",
            "sub_type": "PAST",
            "group": "CASES",
            "rarity": "LESS_COMMON",
            "description": "Amount of time since the conversation was first assigned",
            "input_type": "TIME",
            "operators": [
                "time_greaterthan",
                "time_greaterthan_businesshours",
                "time_greaterthan_or_equalto",
                "time_greaterthan_or_equalto_businesshours",
                "time_lessthan",
                "time_lessthan_businesshours",
                "time_lessthan_or_equalto",
                "time_lessthan_or_equalto_businesshours"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Time since latest update made by requester",
            "field": "casemetrics.lastrequesteractivityat",
            "type": "TIME",
            "sub_type": "PAST",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Amount of time since the requester updated the conversation",
            "input_type": "TIME",
            "operators": [
                "time_greaterthan",
                "time_greaterthan_businesshours",
                "time_greaterthan_or_equalto",
                "time_greaterthan_or_equalto_businesshours",
                "time_lessthan",
                "time_lessthan_businesshours",
                "time_lessthan_or_equalto",
                "time_lessthan_or_equalto_businesshours"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Time since latest update made by assignee",
            "field": "cases.lastagentactivityat",
            "type": "TIME",
            "sub_type": "PAST",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Amount of time since the assignee updated the conversation",
            "input_type": "TIME",
            "operators": [
                "time_greaterthan",
                "time_greaterthan_businesshours",
                "time_greaterthan_or_equalto",
                "time_greaterthan_or_equalto_businesshours",
                "time_lessthan",
                "time_lessthan_businesshours",
                "time_lessthan_or_equalto",
                "time_lessthan_or_equalto_businesshours"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Time since completed",
            "field": "cases.lastcompletedat",
            "type": "TIME",
            "sub_type": "PAST",
            "group": "CASES",
            "rarity": "LESS_COMMON",
            "description": "Amount of time since the conversation was completed",
            "input_type": "TIME",
            "operators": [
                "time_greaterthan",
                "time_greaterthan_businesshours",
                "time_greaterthan_or_equalto",
                "time_greaterthan_or_equalto_businesshours",
                "time_lessthan",
                "time_lessthan_businesshours",
                "time_lessthan_or_equalto",
                "time_lessthan_or_equalto_businesshours"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Time since requester received a reply",
            "field": "casemetrics.agentlastpostcreatedat",
            "type": "TIME",
            "sub_type": "PAST",
            "group": "CASES",
            "rarity": "LESS_COMMON",
            "description": "Amount of time since the requester received a reply",
            "input_type": "TIME",
            "operators": [
                "time_greaterthan",
                "time_greaterthan_businesshours",
                "time_greaterthan_or_equalto",
                "time_greaterthan_or_equalto_businesshours",
                "time_lessthan",
                "time_lessthan_businesshours",
                "time_lessthan_or_equalto",
                "time_lessthan_or_equalto_businesshours"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Time spent in current status",
            "field": "casemetrics.statusupdatedat",
            "type": "TIME",
            "sub_type": "PAST",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Amount of time the conversation has spent in its current status",
            "input_type": "TIME",
            "operators": [
                "time_greaterthan",
                "time_greaterthan_or_equalto",
                "time_lessthan",
                "time_lessthan_or_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Time to next breach",
            "field": "caseslametricevents.time_to_next_breach",
            "type": "TIME",
            "sub_type": "FUTURE",
            "group": "SLA",
            "rarity": "COMMON",
            "description": "Amount of time remaining until the conversation breaches any SLA target",
            "input_type": "TIME",
            "operators": [
                "time_greaterthan",
                "time_greaterthan_or_equalto",
                "time_lessthan",
                "time_lessthan_or_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Time since last breach",
            "field": "caseslametricevents.time_since_last_breach",
            "type": "TIME",
            "sub_type": "PAST",
            "group": "SLA",
            "rarity": "LESS_COMMON",
            "description": "Amount of time since the conversation has breached any SLA target",
            "input_type": "TIME",
            "operators": [
                "time_greaterthan",
                "time_greaterthan_or_equalto",
                "time_lessthan",
                "time_lessthan_or_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "First response time remaining",
            "field": "caseslametricevents.first_response_time_remaining",
            "type": "TIME",
            "sub_type": "FUTURE",
            "group": "SLA",
            "rarity": "LESS_COMMON",
            "description": "Amount of time remaining until the conversation breaches its first reply time target",
            "input_type": "TIME",
            "operators": [
                "time_greaterthan",
                "time_greaterthan_or_equalto",
                "time_lessthan",
                "time_lessthan_or_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Reply time remaining",
            "field": "caseslametricevents.reply_time_remaining",
            "type": "TIME",
            "sub_type": "FUTURE",
            "group": "SLA",
            "rarity": "LESS_COMMON",
            "description": "Amount of time remaining until the conversation breaches its resolution target",
            "input_type": "TIME",
            "operators": [
                "time_greaterthan",
                "time_greaterthan_or_equalto",
                "time_lessthan",
                "time_lessthan_or_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Resolution time remaining",
            "field": "caseslametricevents.resolution_time_remaining",
            "type": "TIME",
            "sub_type": "FUTURE",
            "group": "SLA",
            "rarity": "LESS_COMMON",
            "description": "Amount of time remaining until the conversation breaches its resolution target",
            "input_type": "TIME",
            "operators": [
                "time_greaterthan",
                "time_greaterthan_or_equalto",
                "time_lessthan",
                "time_lessthan_or_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        }
    ],
    "resource": "definition",
    "total_count": 49
}
```




### Triggers

Title: Triggers - Automation | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/automation/triggers/

Markdown Content:
```
{
    "status": 200,
    "data": [
        {
            "label": "Subject",
            "field": "cases.subject",
            "type": "STRING",
            "sub_type": "",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Conversation's subject",
            "input_type": "STRING",
            "operators": [
                "string_contains_insensitive",
                "string_does_not_contain_insensitive",
                "history_changed",
                "history_not_changed"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Status",
            "field": "cases.casestatusid",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Status of conversation",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto",
                "history_changed",
                "history_changed_to",
                "history_changed_from",
                "history_not_changed",
                "history_not_changed_to",
                "history_not_changed_from"
            ],
            "values": {
                "1": "New",
                "2": "Open",
                "3": "Pending",
                "4": "Completed"
            },
            "resource_type": "definition"
        },
        {
            "label": "Priority",
            "field": "cases.casepriorityid",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Priority of conversation",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto",
                "comparison_lessthan",
                "comparison_greaterthan",
                "history_changed",
                "history_changed_to",
                "history_changed_from",
                "history_not_changed",
                "history_not_changed_to",
                "history_not_changed_from"
            ],
            "values": {
                "0": "none",
                "1": "Low",
                "2": "Normal",
                "3": "High",
                "4": "Urgent"
            },
            "resource_type": "definition"
        },
        {
            "label": "Type",
            "field": "cases.casetypeid",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Conversation type",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto",
                "history_changed",
                "history_changed_to",
                "history_changed_from",
                "history_not_changed",
                "history_not_changed_to",
                "history_not_changed_from"
            ],
            "values": {
                "0": "none",
                "1": "Question",
                "2": "Task",
                "3": "Problem",
                "4": "Incident"
            },
            "resource_type": "definition"
        },
        {
            "label": "Team",
            "field": "cases.assigneeteamid",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Team assigned to conversation",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto",
                "history_changed",
                "history_changed_to",
                "history_changed_from",
                "history_not_changed",
                "history_not_changed_to",
                "history_not_changed_from"
            ],
            "values": {
                "0": "(Unassigned)",
                "1": "General",
                "(current_users_team)": "(current user's team)"
            },
            "resource_type": "definition"
        },
        {
            "label": "Assignee",
            "field": "cases.assigneeagentid",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Agent assigned to conversation",
            "input_type": "AUTOCOMPLETE",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto",
                "history_changed",
                "history_changed_to",
                "history_changed_from",
                "history_not_changed",
                "history_not_changed_to",
                "history_not_changed_from"
            ],
            "values": {
                "0": "(Unassigned)",
                "(current_user)": "(Current user)",
                "(requester)": "(Requester)"
            },
            "resource_type": "definition"
        },
        {
            "label": "Requester",
            "field": "cases.requesterid",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Requester of the conversation",
            "input_type": "AUTOCOMPLETE",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto",
                "history_changed",
                "history_changed_to",
                "history_changed_from",
                "history_not_changed",
                "history_not_changed_to",
                "history_not_changed_from"
            ],
            "values": {
                "(current_user)": "(Current user)",
                "(assignee)": "(Assignee)"
            },
            "resource_type": "definition"
        },
        {
            "label": "Organization",
            "field": "users.organizationid",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Requester's organization",
            "input_type": "AUTOCOMPLETE",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto",
                "history_changed",
                "history_changed_to",
                "history_changed_from",
                "history_not_changed",
                "history_not_changed_to",
                "history_not_changed_from"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Tags",
            "field": "tags.name",
            "type": "COLLECTION",
            "sub_type": "",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Tags added to conversation",
            "input_type": "TAGS",
            "operators": [
                "collection_contains_insensitive",
                "collection_contains_any_insensitive",
                "collection_does_not_contain_insensitive",
                "history_changed",
                "history_not_changed"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Brand",
            "field": "cases.brandid",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Brand to which conversation belongs",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto",
                "history_changed",
                "history_changed_to",
                "history_changed_from",
                "history_not_changed",
                "history_not_changed_to",
                "history_not_changed_from"
            ],
            "values": {
                "1": "Brewfictus"
            },
            "resource_type": "definition"
        },
        {
            "label": "Source Channel",
            "field": "cases.channel",
            "type": "STRING",
            "sub_type": "",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Channel over which the conversation was started",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto",
                "history_changed",
                "history_changed_to",
                "history_changed_from",
                "history_not_changed",
                "history_not_changed_to",
                "history_not_changed_from"
            ],
            "values": {
                "MAIL": "Mail",
                "MESSENGER": "Messenger",
                "FACEBOOK": "Facebook",
                "TWITTER": "Twitter",
                "NOTE": "Note",
                "HELPCENTER": "Helpcenter"
            },
            "resource_type": "definition"
        },
        {
            "label": "Satisfaction status",
            "field": "cases.satisfactionstatus",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "SATISFACTION",
            "rarity": "COMMON",
            "description": "The status of satisfaction offering for the conversation",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto",
                "history_changed",
                "history_changed_to",
                "history_changed_from",
                "history_not_changed",
                "history_not_changed_to",
                "history_not_changed_from"
            ],
            "values": {
                "1": "UNOFFERED",
                "2": "OFFERED",
                "3": "RECEIVED"
            },
            "resource_type": "definition"
        },
        {
            "label": "Satisfaction rating",
            "field": "cases.rating",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "SATISFACTION",
            "rarity": "COMMON",
            "description": "Satisfaction rating for the conversation",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto",
                "history_changed",
                "history_changed_to",
                "history_changed_from",
                "history_not_changed",
                "history_not_changed_to",
                "history_not_changed_from"
            ],
            "values": {
                "0": "Not set",
                "1": "Good",
                "-1": "Bad"
            },
            "resource_type": "definition"
        },
        {
            "label": "SLA",
            "field": "cases.slaversionid",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "SLA",
            "rarity": "COMMON",
            "description": "SLA that's applied to the conversation",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto",
                "history_changed",
                "history_changed_to",
                "history_changed_from",
                "history_not_changed",
                "history_not_changed_to",
                "history_not_changed_from"
            ],
            "values": {
                "0": "none",
                "1": "VIP Customer"
            },
            "resource_type": "definition"
        },
        {
            "label": "SLA breached",
            "field": "cases.isslabreached",
            "type": "BOOLEAN",
            "sub_type": "",
            "group": "SLA",
            "rarity": "COMMON",
            "description": "Whether or not the conversation has breached any of its SLA targets",
            "input_type": "BOOLEAN_TRUE",
            "operators": [
                "comparison_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Number of reopens",
            "field": "casemetrics.reopencount",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "LESS_COMMON",
            "description": "Number of times conversation has been reopened",
            "input_type": "INTEGER",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto",
                "comparison_greaterthan",
                "comparison_greaterthan_or_equalto",
                "comparison_lessthan",
                "comparison_lessthan_or_equalto",
                "history_changed",
                "history_changed_to",
                "history_changed_from",
                "history_not_changed_to",
                "history_not_changed_from"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Number of agent replies",
            "field": "casemetrics.agentreplycount",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "LESS_COMMON",
            "description": "Number of agent replies on conversation",
            "input_type": "INTEGER",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto",
                "comparison_greaterthan",
                "comparison_greaterthan_or_equalto",
                "comparison_lessthan",
                "comparison_lessthan_or_equalto",
                "history_changed",
                "history_changed_to",
                "history_changed_from",
                "history_not_changed_to",
                "history_not_changed_from"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Number of requester replies",
            "field": "casemetrics.requesterreplycount",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "LESS_COMMON",
            "description": "Number of times requester has replied",
            "input_type": "INTEGER",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto",
                "comparison_greaterthan",
                "comparison_greaterthan_or_equalto",
                "comparison_lessthan",
                "comparison_lessthan_or_equalto",
                "history_changed",
                "history_changed_to",
                "history_changed_from",
                "history_not_changed_to",
                "history_not_changed_from"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Number of replies",
            "field": "casemetrics.replycount",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "LESS_COMMON",
            "description": "Number of total replies on a conversation",
            "input_type": "INTEGER",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto",
                "comparison_greaterthan",
                "comparison_greaterthan_or_equalto",
                "comparison_lessthan",
                "comparison_lessthan_or_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Number of agent reassignments",
            "field": "casemetrics.assigneechangecount",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "LESS_COMMON",
            "description": "Number of times assignee has been changed",
            "input_type": "INTEGER",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto",
                "comparison_greaterthan",
                "comparison_greaterthan_or_equalto",
                "comparison_lessthan",
                "comparison_lessthan_or_equalto",
                "history_changed",
                "history_changed_to",
                "history_changed_from",
                "history_not_changed_to",
                "history_not_changed_from"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Number of team reassignments",
            "field": "casemetrics.teamchangecount",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "LESS_COMMON",
            "description": "Number of times team has been changed",
            "input_type": "INTEGER",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto",
                "comparison_greaterthan",
                "comparison_greaterthan_or_equalto",
                "comparison_lessthan",
                "comparison_lessthan_or_equalto",
                "history_changed",
                "history_changed_to",
                "history_changed_from",
                "history_not_changed_to",
                "history_not_changed_from"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Last update by user",
            "field": "cases.lastupdatedby",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "LESS_COMMON",
            "description": "User who made the last update",
            "input_type": "AUTOCOMPLETE",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto",
                "history_changed",
                "history_changed_to",
                "history_changed_from",
                "history_not_changed",
                "history_not_changed_to",
                "history_not_changed_from"
            ],
            "values": {
                "(assignee)": "(Assignee)",
                "(requester)": "(Requester)"
            },
            "resource_type": "definition"
        },
        {
            "label": "Last update by user role",
            "field": "roles.type",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "LESS_COMMON",
            "description": "Role of the user who made the last update",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto",
                "history_changed",
                "history_changed_to",
                "history_changed_from",
                "history_not_changed",
                "history_not_changed_to",
                "history_not_changed_from"
            ],
            "values": {
                "1": "Owner",
                "2": "Admin",
                "3": "Agent",
                "4": "Collaborator",
                "5": "Customer"
            },
            "resource_type": "definition"
        },
        {
            "label": "Language",
            "field": "users.languageid",
            "type": "STRING",
            "sub_type": "",
            "group": "REQUESTER",
            "rarity": "LESS_COMMON",
            "description": "Requester's language",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "2": "en-us"
            },
            "resource_type": "definition"
        },
        {
            "label": "Timezone",
            "field": "users.timezone",
            "type": "STRING",
            "sub_type": "",
            "group": "REQUESTER",
            "rarity": "LESS_COMMON",
            "description": "Requester's timezone",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "Africa/Abidjan": "Africa/Abidjan",
                "Africa/Accra": "Africa/Accra",
                "UTC": "UTC"
            },
            "resource_type": "definition"
        },
        {
            "label": "Tags",
            "field": "requester.tags",
            "type": "COLLECTION",
            "sub_type": "",
            "group": "REQUESTER",
            "rarity": "COMMON",
            "description": "Tags that have been added to the organization's profile",
            "input_type": "TAGS",
            "operators": [
                "collection_contains_insensitive",
                "collection_contains_any_insensitive",
                "collection_does_not_contain_insensitive"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Tags",
            "field": "organization.tags",
            "type": "COLLECTION",
            "sub_type": "",
            "group": "ORGANIZATION",
            "rarity": "COMMON",
            "description": "Tags that have been added to the organization's profile",
            "input_type": "TAGS",
            "operators": [
                "collection_contains_insensitive",
                "collection_contains_any_insensitive",
                "collection_does_not_contain_insensitive"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Form",
            "field": "cases.caseformid",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Form linked to conversation",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto",
                "history_changed",
                "history_changed_to",
                "history_changed_from",
                "history_not_changed",
                "history_not_changed_to",
                "history_not_changed_from"
            ],
            "values": {
                "0": "none",
                "1": "Default"
            },
            "resource_type": "definition"
        },
        {
            "label": "Time since conversation created",
            "field": "cases.createdat",
            "type": "TIME",
            "sub_type": "PAST",
            "group": "CASES",
            "rarity": "LESS_COMMON",
            "description": "Amount of time since the conversation was created",
            "input_type": "TIME",
            "operators": [
                "time_greaterthan",
                "time_greaterthan_businesshours",
                "time_greaterthan_or_equalto",
                "time_greaterthan_or_equalto_businesshours",
                "time_lessthan",
                "time_lessthan_businesshours",
                "time_lessthan_or_equalto",
                "time_lessthan_or_equalto_businesshours"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Time since last update",
            "field": "cases.updatedat",
            "type": "TIME",
            "sub_type": "PAST",
            "group": "CASES",
            "rarity": "LESS_COMMON",
            "description": "Amount of time since the last update to the conversation",
            "input_type": "TIME",
            "operators": [
                "time_greaterthan",
                "time_greaterthan_businesshours",
                "time_greaterthan_or_equalto",
                "time_greaterthan_or_equalto_businesshours",
                "time_lessthan",
                "time_lessthan_businesshours",
                "time_lessthan_or_equalto",
                "time_lessthan_or_equalto_businesshours"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Role",
            "field": "requester.roletype",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "REQUESTER",
            "rarity": "LESS_COMMON",
            "description": "Requester's role",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "1": "Owner",
                "2": "Admin",
                "3": "Agent",
                "4": "Collaborator",
                "5": "Customer"
            },
            "resource_type": "definition"
        },
        {
            "label": "Primary email",
            "field": "identityemails.address",
            "type": "STRING",
            "sub_type": "",
            "group": "REQUESTER",
            "rarity": "LESS_COMMON",
            "description": "Requester's primary email address",
            "input_type": "STRING",
            "operators": [
                "string_contains_insensitive",
                "string_does_not_contain_insensitive"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Number of Twitter followers",
            "field": "identitytwitter.followercount",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "REQUESTER",
            "rarity": "LESS_COMMON",
            "description": "Number of followers on the requester's twitter account",
            "input_type": "INTEGER",
            "operators": [
                "comparison_equalto",
                "comparison_greaterthan",
                "comparison_lessthan"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Twitter account verified",
            "field": "identitytwitter.isverified",
            "type": "BOOLEAN",
            "sub_type": "",
            "group": "REQUESTER",
            "rarity": "LESS_COMMON",
            "description": "Whether the requester's Twitter account is verified",
            "input_type": "BOOLEAN_TRUE",
            "operators": [
                "comparison_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "State",
            "field": "cases.state",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "LESS_COMMON",
            "description": "Whether conversation is in the trash",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto",
                "history_changed",
                "history_changed_to",
                "history_changed_from",
                "history_not_changed",
                "history_not_changed_to",
                "history_not_changed_from"
            ],
            "values": {
                "1": "ACTIVE",
                "2": "TRASH"
            },
            "resource_type": "definition"
        },
        {
            "label": "Number of email attachments",
            "field": "mail.attachmentcount",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "MAIL",
            "rarity": "LESS_COMMON",
            "description": "Number of files attached to the email",
            "input_type": "INTEGER",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto",
                "comparison_greaterthan",
                "comparison_greaterthan_or_equalto",
                "comparison_lessthan",
                "comparison_lessthan_or_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Received at",
            "field": "mail.mailbox",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "MAIL",
            "rarity": "COMMON",
            "description": "Email address at which the message was received",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "1": "support@brewfictus.kayako.com"
            },
            "resource_type": "definition"
        },
        {
            "label": "Attachment names",
            "field": "mail.attachmentname",
            "type": "STRING",
            "sub_type": "",
            "group": "MAIL",
            "rarity": "LESS_COMMON",
            "description": "Filenames of any email attachments",
            "input_type": "STRING",
            "operators": [
                "string_contains_insensitive",
                "string_does_not_contain_insensitive"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Subject",
            "field": "mail.subject",
            "type": "STRING",
            "sub_type": "",
            "group": "MAIL",
            "rarity": "LESS_COMMON",
            "description": "Email subject line",
            "input_type": "STRING",
            "operators": [
                "string_contains_insensitive",
                "string_does_not_contain_insensitive"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Reply-to",
            "field": "mail.replyto",
            "type": "STRING",
            "sub_type": "",
            "group": "MAIL",
            "rarity": "LESS_COMMON",
            "description": "Reply-to address of the email",
            "input_type": "STRING",
            "operators": [
                "string_contains_insensitive",
                "string_does_not_contain_insensitive"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "From name",
            "field": "mail.sendername",
            "type": "STRING",
            "sub_type": "",
            "group": "MAIL",
            "rarity": "COMMON",
            "description": "Name of the sender",
            "input_type": "STRING",
            "operators": [
                "string_contains_insensitive",
                "string_does_not_contain_insensitive"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "From address",
            "field": "mail.senderaddress",
            "type": "STRING",
            "sub_type": "",
            "group": "MAIL",
            "rarity": "COMMON",
            "description": "Email address of the sender",
            "input_type": "STRING",
            "operators": [
                "string_contains_insensitive",
                "string_does_not_contain_insensitive"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Raw message headers",
            "field": "mail.headers",
            "type": "STRING",
            "sub_type": "",
            "group": "MAIL",
            "rarity": "LESS_COMMON",
            "description": "Contents of the email headers",
            "input_type": "STRING",
            "operators": [
                "string_regularexpression"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "CC recipients",
            "field": "mail.ccrecipients",
            "type": "STRING",
            "sub_type": "",
            "group": "MAIL",
            "rarity": "LESS_COMMON",
            "description": "Email addresses of any CC recipients",
            "input_type": "STRING",
            "operators": [
                "string_contains_insensitive",
                "string_does_not_contain_insensitive"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "BCC recipients",
            "field": "mail.bccrecipients",
            "type": "STRING",
            "sub_type": "",
            "group": "MAIL",
            "rarity": "LESS_COMMON",
            "description": "Email addresses of any BCC recipients",
            "input_type": "STRING",
            "operators": [
                "string_contains_insensitive",
                "string_does_not_contain_insensitive"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Update type",
            "field": "case.updateeventtype",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Type of update, whether it's a new conversation or a change to an existing one",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "1": "Any type of update",
                "2": "Existing conversation update",
                "3": "New conversation created"
            },
            "resource_type": "definition"
        },
        {
            "label": "Updated during",
            "field": "case.updatedduring",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "LESS_COMMON",
            "description": "Business hours during which the update was made",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "1": "Default",
                "-1": "(Assigned team's hours)",
                "-2": "(Any time)"
            },
            "resource_type": "definition"
        },
        {
            "label": "Updated by user role",
            "field": "case.currentusersroletype",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Role of the user who makes an update that fires this trigger",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "1": "Owner",
                "2": "Admin",
                "3": "Agent",
                "4": "Collaborator",
                "5": "Customer"
            },
            "resource_type": "definition"
        },
        {
            "label": "Updated by user",
            "field": "case.currentuser",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "User who makes an update that fires this trigger",
            "input_type": "AUTOCOMPLETE",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "New message type",
            "field": "case.newpost",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "CASES",
            "rarity": "COMMON",
            "description": "Type of message, either a private note or a reply to the customer",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "6": "Any (Reply or Note)",
                "7": "Reply only"
            },
            "resource_type": "definition"
        },
        {
            "label": "Message content",
            "field": "case.postcontents",
            "type": "STRING",
            "sub_type": "",
            "group": "CASES",
            "rarity": "LESS_COMMON",
            "description": "Contents of the new message",
            "input_type": "STRING",
            "operators": [
                "string_contains_insensitive",
                "string_does_not_contain_insensitive"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Page URL",
            "field": "caseposts.page_url",
            "type": "STRING",
            "sub_type": "",
            "group": "MESSENGER",
            "rarity": "COMMON",
            "description": "URL of the page the Messenger conversation is happening on",
            "input_type": "STRING",
            "operators": [
                "string_contains_insensitive",
                "string_does_not_contain_insensitive"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "SLA metric breached",
            "field": "caseslametrics.breached",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "SLA",
            "rarity": "LESS_COMMON",
            "description": "",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "1": "FIRST_REPLY_TIME",
                "2": "NEXT_REPLY_TIME",
                "3": "RESOLUTION_TIME"
            },
            "resource_type": "definition"
        },
        {
            "label": "Satisfaction comment",
            "field": "satisfactionratings.comment",
            "type": "STRING",
            "sub_type": "",
            "group": "SATISFACTION",
            "rarity": "COMMON",
            "description": "Satisfaction comment is updated on conversation",
            "input_type": "STRING",
            "operators": [
                "history_changed"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Received at",
            "field": "facebookpages.title",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "FACEBOOK",
            "rarity": "",
            "description": "",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "1": "543w5"
            },
            "resource_type": "definition"
        },
        {
            "label": "Received at",
            "field": "twitteraccounts.screenname",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "TWITTER",
            "rarity": "",
            "description": "",
            "input_type": "OPTIONS",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto"
            ],
            "values": {
                "1": "TaylorWestRnbw",
                "2": "TobyBrewfictus"
            },
            "resource_type": "definition"
        },
        {
            "label": "From Handle",
            "field": "identitytwitter.screenname",
            "type": "STRING",
            "sub_type": "",
            "group": "TWITTER",
            "rarity": "",
            "description": "",
            "input_type": "STRING",
            "operators": [
                "string_contains_insensitive",
                "string_does_not_contain_insensitive"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Likes",
            "field": "tweets.favoritecount",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "TWITTER",
            "rarity": "",
            "description": "",
            "input_type": "INTEGER",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto",
                "comparison_greaterthan",
                "comparison_greaterthan_or_equalto",
                "comparison_lessthan",
                "comparison_lessthan_or_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Retweets",
            "field": "tweets.retweetcount",
            "type": "NUMERIC",
            "sub_type": "INTEGER",
            "group": "TWITTER",
            "rarity": "",
            "description": "",
            "input_type": "INTEGER",
            "operators": [
                "comparison_equalto",
                "comparison_not_equalto",
                "comparison_greaterthan",
                "comparison_greaterthan_or_equalto",
                "comparison_lessthan",
                "comparison_lessthan_or_equalto"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "test",
            "field": "casefields.test",
            "type": "STRING",
            "sub_type": "",
            "group": "CASES",
            "rarity": "LESS_COMMON",
            "description": "",
            "input_type": "STRING",
            "operators": [
                "string_contains_insensitive",
                "string_does_not_contain",
                "history_changed",
                "history_not_changed"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Your product url",
            "field": "casefields.your_product_url",
            "type": "STRING",
            "sub_type": "",
            "group": "CASES",
            "rarity": "LESS_COMMON",
            "description": "",
            "input_type": "STRING",
            "operators": [
                "string_contains_insensitive",
                "string_does_not_contain",
                "history_changed",
                "history_not_changed"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "test",
            "field": "organizationfields.test",
            "type": "STRING",
            "sub_type": "",
            "group": "ORGANIZATION",
            "rarity": "LESS_COMMON",
            "description": "",
            "input_type": "STRING",
            "operators": [
                "string_contains_insensitive",
                "string_does_not_contain_insensitive",
                "history_changed",
                "history_not_changed"
            ],
            "values": null,
            "resource_type": "definition"
        },
        {
            "label": "Customer Success Manager",
            "field": "organizationfields.customer_success_manager",
            "type": "STRING",
            "sub_type": "",
            "group": "ORGANIZATION",
            "rarity": "LESS_COMMON",
            "description": "",
            "input_type": "STRING",
            "operators": [
                "string_contains_insensitive",
                "string_does_not_contain_insensitive",
                "history_changed",
                "history_not_changed"
            ],
            "values": null,
            "resource_type": "definition"
        }
    ],
    "resource": "definition",
    "total_count": 63
}
```




---

## Channels / Twitter


### Accounts

Title: Accounts - Twitter | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/twitter/accounts/

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   CHANNELS
4.   TWITTER

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| uuid | string |  |  |
| screen_name | string |  | The Twitter Handle |
| profile_image_url | string |  |  |
| brand | [Brand](https://developer.kayako.com/api/v1/general/brands/) |  |  |
| route_mentions | boolean |  | Enable the routing for the twitter mentions timeline **Default:**`true` |
| route_messages | boolean |  | Enable the routing for the twitter direct messages **Default:**`true` |
| route_favorites | boolean |  | Enable the routing for the twitter home timeline **Default:**`true` |
| show_in_help_center | boolean |  | Display latest tweets on home page **Default:**`true` |
| status | string |  | `AVAILABLE`, `UNAVAILABLE`, `NOT_AUTHORIZED` **Default:**`AVAILABLE` |
| is_enabled | boolean |  | **Default:**`true` |
| last_synced_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve all accounts

GET**/api/v1/twitter/accounts.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Ordered by id (descending)

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": "3155953718",
            "uuid": "cc9e8868-3023-4df9-bd90-d8f1135c1f21",
            "screen_name": "brewfictus",
            "profile_image_url": "http://abs.twimg.com/sticky/default_profile_images/default_profile_6_normal.png",
            "brand": {
                "id": 1,
                "resource_type": "brand"
            },
            "route_mentions": true,
            "route_messages": true,
            "route_favorites": true,
            "show_in_help_center": true,
            "status": "AVAILABLE",
            "is_enabled": true,
            "last_synced_at": "2015-07-29T01:14:19+05:00",
            "created_at": "2015-07-29T01:14:19+05:00",
            "updated_at": "2015-07-29T01:14:19+05:00",
            "resource_type": "twitter_account",
            "resource_url": "https://brewfictus.kayako.com/api/v1/twitter/accounts/3155953718"
        }
    ],
    "resource": "twitter_account",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Retrieve an account

GET**/api/v1/twitter/accounts/:id.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners

### Response

```
{
    "status": 200,
    "data": {
        "id": "3155953718",
        "uuid": "cc9e8868-3023-4df9-bd90-d8f1135c1f21",
        "screen_name": "brewfictus",
        "profile_image_url": "http://abs.twimg.com/sticky/default_profile_images/default_profile_6_normal.png",
        "brand": {
            "id": 1,
            "resource_type": "brand"
        },
        "route_mentions": true,
        "route_messages": true,
        "route_favorites": true,
        "show_in_help_center": true,
        "status": "AVAILABLE",
        "is_enabled": true,
        "last_synced_at": "2015-07-29T01:14:19+05:00",
        "created_at": "2015-07-29T01:14:19+05:00",
        "updated_at": "2015-07-29T01:14:19+05:00",
        "resource_type": "twitter_account",
        "resource_url": "https://brewfictus.kayako.com/api/v1/twitter/accounts/3155953718"
    },
    "resource": "twitter_account"
}
```

## Update an account

PUT**/api/v1/twitter/accounts/:id.json**

### Information

Allowed for Admins & Owners

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| brand_id | integer |  |  |
| route_mentions | boolean |  |  |
| route_messages | boolean |  |  |
| route_favorites | boolean |  |  |
| show_in_help_center | boolean |  |  |
| is_enabled | boolean |  |  |

### Response

```
{
    "status": 200,
    "data": {
        "id": "3155953718",
        "uuid": "cc9e8868-3023-4df9-bd90-d8f1135c1f21",
        "screen_name": "brewfictus",
        "profile_image_url": "http://abs.twimg.com/sticky/default_profile_images/default_profile_6_normal.png",
        "brand": {
            "id": 1,
            "resource_type": "brand"
        },
        "route_mentions": true,
        "route_messages": true,
        "route_favorites": true,
        "show_in_help_center": true,
        "status": "AVAILABLE",
        "is_enabled": true,
        "last_synced_at": "2015-07-29T01:14:19+05:00",
        "created_at": "2015-07-29T01:14:19+05:00",
        "updated_at": "2015-07-29T01:14:19+05:00",
        "resource_type": "twitter_account",
        "resource_url": "https://brewfictus.kayako.com/api/v1/twitter/accounts/3155953718"
    },
    "resource": "twitter_account"
}
```

## Update accounts

PUT**/api/v1/twitter/accounts.json**

### Information

Allowed for Admins & Owners

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| brand_id | integer |  |  |
| route_mentions | boolean |  |  |
| route_messages | boolean |  |  |
| route_favorites | boolean |  |  |
| show_in_help_center | boolean |  |  |
| is_enabled | boolean |  |  |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```

## Delete an account

DELETE**/api/v1/twitter/accounts/:id.json**

### Information

Allowed for Admins & Owners

### Response

```
{
    "status": 200
}
```

## Delete accounts

DELETE**/api/v1/twitter/accounts.json**

### Information

Allowed for Admins & Owners

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```




### Tweets

Title: Tweets - Twitter | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/twitter/tweets/

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   CHANNELS
4.   TWITTER

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| uuid | string |  |  |
| screen_name | string |  |  |
| full_name | string |  |  |
| contents | string |  |  |
| retweet_count | integer |  |  |
| favorite_count | integer |  |  |
| in_reply_to_tweet | [Tweet](https://developer.kayako.com/api/v1/twitter/tweets/) |  |  |
| in_reply_to_identity | [Identity](https://developer.kayako.com/api/v1/users/identities/#Twitter) |  |  |
| media | [Media](https://developer.kayako.com/api/v1/twitter/tweets/#media) |  |  |
| attachments | [Attachments](https://developer.kayako.com/api/v1/twitter/tweets/#attachments) |  |  |
| download_all | string |  | Download all attachment as zip |
| identity | [Identity](https://developer.kayako.com/api/v1/users/identities/#Twitter) |  |  |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| media_url | string |  |  |
| media_url_https | string |  |  |
| url | string |  |  |
| display_url | string |  |  |
| expanded_url | string |  |  |

## Attachments

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| size | integer |  |  |
| width | integer |  | Only if the attachment is image |
| height | integer |  | Only if the attachment is image |
| type | string |  | Mime-type of the file |
| content_id | string |  | Content ID used for inline attachment |
| alt | string |  |  |
| url | string |  | The URL to view the attachment |
| url_download | string |  | The URL to download the attachment |
| thumbnails | [Thumbnails](https://developer.kayako.com/api/v1/twitter/tweets/#thumbnails) |  |  |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Thumbnails

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| size | integer |  |  |
| width | integer |  |  |
| height | integer |  |  |
| type | string |  | Mime-type of the file |
| url | string |  | The URL to view the thumbnail |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve latest tweets

GET**/api/v1/twitter/tweets/latest.json**

### Information

Allowed for Public
Ordered by created_at (descending)

Retrieve latest three tweets for Twitter accounts enabled for public.

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| account_ids | string |  | List of [Account](https://developer.kayako.com/api/v1/twitter/accounts/) IDs (comma-separated) to filter tweets by. If not supplied, tweets from all enabled accounts are listed |

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": "588337651050119168",
            "uuid": "a001cc05-5340-4c74-8470-d1154041fbf5",
            "screen_name": "brewfictus",
            "full_name": "Ben Pigford",
            "contents": "Subscription coffee and specialist equipment. Planning on launching a cafe.",
            "retweet_count": 5,
            "favorite_count": 3,
            "in_reply_to_tweet": null,
            "in_reply_to_identity": null,
            "media": [],
            "attachments": [],
            "download_all": null,
            "identity": {
                "id": 1,
                "resource_type": "identity_twitter"
            },
            "created_at": "2015-04-15T13:46:41+05:00",
            "updated_at": "2015-04-15T13:46:41+05:00",
            "resource_type": "twitter_tweet",
            "resource_url": "https://brewfictus.kayako.com/api/v1/twitter/tweets/588337651050119168"
        }
    ],
    "resource": "twitter_tweet",
    "offset": 0,
    "limit": 3,
    "total_count": 1
}
```




---

## Channels / Facebook


### Accounts

Title: Accounts - Facebook | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/facebook/accounts/

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   CHANNELS
4.   FACEBOOK

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| account_id | string |  |  |
| title | string |  |  |
| profile_image_url | string |  |  |
| status | string |  | `AVAILABLE`, `UNAVAILABLE`, `NOT_AUTHORIZED` **Default:**`AVAILABLE` |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve all accounts

GET**/api/v1/facebook/accounts.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Ordered by id (ascending)

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "account_id": "1399177110403746",
            "title": "Brewfictus",
            "profile_image_url": null,
            "status": "AVAILABLE",
            "created_at": "2015-07-26T06:40:32+05:00",
            "updated_at": "2015-07-26T06:40:32+05:00",
            "resource_type": "facebook_account",
            "resource_url": "https://brewfictus.kayako.com/api/v1/facebook/accounts/1"
        }
    ],
    "resource": "facebook_account",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Retrieve an account

GET**/api/v1/facebook/accounts/:id.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "account_id": "1399177110403746",
        "title": "Brewfictus",
        "profile_image_url": null,
        "status": "AVAILABLE",
        "created_at": "2015-07-26T06:40:32+05:00",
        "updated_at": "2015-07-26T06:40:32+05:00",
        "resource_type": "facebook_account",
        "resource_url": "https://brewfictus.kayako.com/api/v1/facebook/accounts/1"
    },
    "resource": "facebook_account"
}
```

## Add an account

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| link | string |  |  |

## Retrieve link

GET**/api/v1/facebook/account/link.json**

### Information

Allowed for Admins & Owners

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| callback | string |  | The callback URL where Facebook will be redirected to. Example: `/Helpcenter/home/index` |

### Response

## Callback handler

GET**/api/v1/facebook/account/callback.json**

### Information

Allowed for Admins & Owners

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| callback | string |  | callback should be same as used in to retrieve link |
| code | string |  | The Facebook code that appears in the querystring |
| state | string |  | The Facebook state that appears in the querystring |

### Response

```
{
    "status": 201,
    "data": {
        "id": 1,
        "account_id": "1399177110403746",
        "title": "Brewfictus",
        "profile_image_url": null,
        "status": "AVAILABLE",
        "created_at": "2015-07-26T06:40:32+05:00",
        "updated_at": "2015-07-26T06:40:32+05:00",
        "resource_type": "facebook_account",
        "resource_url": "https://brewfictus.kayako.com/api/v1/facebook/accounts/1"
    },
    "resource": "facebook_account_callback"
}
```




### Identities

Title: Identities - Facebook | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/facebook/identities/

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   CHANNELS
4.   FACEBOOK

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| facebook_id | string |  |  |
| user_name | string |  |  |
| full_name | string |  |  |
| email | string |  |  |
| bio | string |  |  |
| birth_date | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| website | string |  |  |
| profile_url | string |  |  |
| locale | string |  |  |
| is_verified | boolean |  | **Default:**`false` |
| is_primary | boolean |  | **Default:**`false` |
| is_validated | boolean |  | **Default:**`false` |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Add an identity

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| link | string |  |  |

## Retrieve link

GET**/api/v1/facebook/identity/link.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| callback | string |  | The callback URL where Facebook will be redirected to. Example: `/Helpcenter/home/index` |

### Response

## Callback handler

GET**/api/v1/facebook/identity/callback.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| callback | string |  | callback should be same as used in to retrieve link |
| code | string |  | The Facebook code that appears in the querystring |
| state | string |  | The Facebook state that appears in the querystring |

### Response

```
{
    "status": 201,
    "data": {
        "identity": {
            "id": 1,
            "facebook_id": "1407638772888867",
            "user_name": null,
            "full_name": "Jordan Mitchell",
            "email": null,
            "bio": null,
            "birth_date": null,
            "website": null,
            "profile_url": null,
            "locale": null,
            "is_verified": false,
            "is_primary": false,
            "is_validated": false,
            "created_at": "2015-07-25T17:47:14+05:00",
            "updated_at": "2015-07-25T17:47:14+05:00",
            "resource_type": "identity_facebook",
            "resource_url": "https://brewfictus.kayako.com/api/v1/identities/facebook/1"
        }
    },
    "resource": "facebook_identity_callback"
}
```




### Pages

Title: Pages - Facebook | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/facebook/pages/

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   CHANNELS
4.   FACEBOOK

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| uuid | string |  |  |
| title | string |  |  |
| image_url | string |  |  |
| account | [Account](https://developer.kayako.com/api/v1/facebook/accounts) |  |  |
| brand | [Brand](https://developer.kayako.com/api/v1/general/brands/) |  |  |
| route_posts | boolean |  | If enabled, automatically convert page post to a conversation **Default:**`true` |
| route_messages | boolean |  | If enabled, automatically convert page conversations to a conversation **Default:**`true` |
| is_enabled | boolean |  |  |
| status | string |  | `AVAILABLE`, `UNAVAILABLE`, `NOT_AUTHORIZED` **Default:**`AVAILABLE` |
| last_synced_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve all pages

GET**/api/v1/facebook/pages.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Ordered by id (ascending)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| account_id | integer |  |  |
| state | string |  | `IMPORTED`, `AVAILABLE`, `ALL` **Default:**`IMPORTED` **IMPORTED:** Facebook pages already linked in helpdesk **AVAILABLE:** Facebook pages that are not already linked in helpdesk |

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": "876423285750729",
            "uuid": "f5ec41e8-fda2-4835-98fb-ea33bc474ce5",
            "title": "Brewfictus the world of better coffee",
            "image_url": null,
            "account": {
                "id": 1,
                "resource_type": "facebook_account"
            },
            "brand": {
                "id": 1,
                "resource_type": "brand"
            },
            "route_posts": true,
            "route_messages": true,
            "is_enabled": true,
            "status": "AVAILABLE",
            "last_synced_at": "2015-07-26T06:40:32+05:00",
            "created_at": "2015-07-26T06:40:32+05:00",
            "updated_at": "2015-07-26T06:40:32+05:00",
            "resource_type": "facebook_page",
            "resource_url": "https://brewfictus.kayako.com/api/v1/facebook/pages/876423285750729"
        }
    ],
    "resource": "facebook_page",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Retrieve a page

GET**/api/v1/facebook/pages/:id.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners

### Response

```
{
    "status": 200,
    "data": {
        "id": "876423285750729",
        "uuid": "f5ec41e8-fda2-4835-98fb-ea33bc474ce5",
        "title": "Brewfictus the world of better coffee",
        "image_url": null,
        "account": {
            "id": 1,
            "resource_type": "facebook_account"
        },
        "brand": {
            "id": 1,
            "resource_type": "brand"
        },
        "route_posts": true,
        "route_messages": true,
        "is_enabled": true,
        "status": "AVAILABLE",
        "last_synced_at": "2015-07-26T06:40:32+05:00",
        "created_at": "2015-07-26T06:40:32+05:00",
        "updated_at": "2015-07-26T06:40:32+05:00",
        "resource_type": "facebook_page",
        "resource_url": "https://brewfictus.kayako.com/api/v1/facebook/pages/876423285750729"
    },
    "resource": "facebook_page"
}
```

## Add pages

POST**/api/v1/facebook/pages.json**

### Information

Allowed for Admins & Owners

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| page_ids | string |  | Comma separated Facebook page ids |

### Response

```
{
    "status": 201,
    "data": [
        {
            "id": "876423285750729",
            "uuid": "f5ec41e8-fda2-4835-98fb-ea33bc474ce5",
            "title": "Brewfictus the world of better coffee",
            "image_url": null,
            "account": {
                "id": 1,
                "resource_type": "facebook_account"
            },
            "brand": {
                "id": 1,
                "resource_type": "brand"
            },
            "route_posts": true,
            "route_messages": true,
            "is_enabled": true,
            "status": "AVAILABLE",
            "last_synced_at": "2015-07-26T06:40:32+05:00",
            "created_at": "2015-07-26T06:40:32+05:00",
            "updated_at": "2015-07-26T06:40:32+05:00",
            "resource_type": "facebook_page",
            "resource_url": "https://brewfictus.kayako.com/api/v1/facebook/pages/876423285750729"
        }
    ],
    "resource": "facebook_page",
    "total_count": 1
}
```

## Update a page

PUT**/api/v1/facebook/pages/:id.json**

### Information

Allowed for Admins & Owners

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| brand_id | integer |  |  |
| route_posts | boolean |  |  |
| route_messages | boolean |  |  |
| is_enabled | boolean |  |  |

### Response

```
{
    "status": 200,
    "data": {
        "id": "876423285750729",
        "uuid": "f5ec41e8-fda2-4835-98fb-ea33bc474ce5",
        "title": "Brewfictus the world of better coffee",
        "image_url": null,
        "account": {
            "id": 1,
            "resource_type": "facebook_account"
        },
        "brand": {
            "id": 1,
            "resource_type": "brand"
        },
        "route_posts": true,
        "route_messages": true,
        "is_enabled": true,
        "status": "AVAILABLE",
        "last_synced_at": "2015-07-26T06:40:32+05:00",
        "created_at": "2015-07-26T06:40:32+05:00",
        "updated_at": "2015-07-26T06:40:32+05:00",
        "resource_type": "facebook_page",
        "resource_url": "https://brewfictus.kayako.com/api/v1/facebook/pages/876423285750729"
    },
    "resource": "facebook_page"
}
```

## Update pages

PUT**/api/v1/facebook/pages.json**

### Information

Allowed for Admins & Owners

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| brand_id | integer |  |  |
| route_posts | boolean |  |  |
| route_messages | boolean |  |  |
| is_enabled | boolean |  |  |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```

## Delete a page

DELETE**/api/v1/facebook/pages/:id.json**

### Information

Allowed for Admins & Owners

### Response

```
{
    "status": 200
}
```

## Delete pages

DELETE**/api/v1/facebook/pages.json**

### Information

Allowed for Admins & Owners

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```




---

## Channels / Mail


### Mailboxes

Title: Mailboxes - Mail | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/mail/mailboxes/

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   CHANNELS
4.   MAIL

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| uuid | string |  |  |
| address | string |  |  |
| brand | [Brand](https://developer.kayako.com/api/v1/general/brands/) |  |  |
| is_system | boolean |  |  |
| is_custom | boolean |  |  |
| is_verified | boolean |  |  |
| is_default | boolean |  |  |
| is_enabled | boolean |  |  |
| is_deleted | boolean |  |  |
| verified_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Mailbox Configuration

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| is_valid | boolean |  | Whether or not the mailbox is configured properly |
| dns_records | [DNS Records](https://developer.kayako.com/api/v1/mail/mailboxes/#dns-record) |  | The expected DNS records to be set for mailbox configuration |

## DNS Record

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| type | string |  | A valid DNS record type, such as `CNAME`, `TXT` |
| domain | string |  | The domain that this DNS record is expected to be set on |
| expected_value | string |  | The expected value for this record |
| actual_values | array |  | The values that are currently present on the domain for this record type. This will be an empty array if no records exist for that record type |
| is_valid | boolean |  | Whether or not the DNS record is setup properly |

## Retrieve all mailboxes

GET**/api/v1/mailboxes.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "uuid": "d2e7d14a-2db0-4af4-81f2-50801bdb6dd9",
            "address": "support@brewfictus.com",
            "brand": {
                "id": 1,
                "resource_type": "brand"
            },
            "is_system": true,
            "is_custom": true,
            "is_verified": true,
            "is_default": true,
            "is_enabled": true,
            "is_deleted": false,
            "verified_at": "2015-07-02T07:28:25+05:00",
            "created_at": "2015-08-18T17:45:49+05:00",
            "updated_at": "2015-08-18T17:45:49+05:00",
            "resource_type": "mailbox",
            "resource_url": "https://brewfictus.kayako.com/api/v1/mailboxes/1"
        }
    ],
    "resource": "mailbox",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Retrieve a mailbox

GET**/api/v1/mailboxes/:id.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "uuid": "d2e7d14a-2db0-4af4-81f2-50801bdb6dd9",
        "address": "support@brewfictus.com",
        "brand": {
            "id": 1,
            "resource_type": "brand"
        },
        "is_system": true,
        "is_custom": true,
        "is_verified": true,
        "is_default": true,
        "is_enabled": true,
        "is_deleted": false,
        "verified_at": "2015-07-02T07:28:25+05:00",
        "created_at": "2015-08-18T17:45:49+05:00",
        "updated_at": "2015-08-18T17:45:49+05:00",
        "resource_type": "mailbox",
        "resource_url": "https://brewfictus.kayako.com/api/v1/mailboxes/1"
    },
    "resource": "mailbox"
}
```

## Retrieve mailbox configuration

GET**/api/v1/mailboxes/:id/configuration.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners

### Response

```
{
    "status": 200,
    "data": {
        "is_valid": true,
        "dns_records": [
            {
                "type": "CNAME",
                "domain": "email.brewfictus.com",
                "expected_value": "email.kayako.com",
                "actual_values": [
                    "email.kayako.com"
                ],
                "is_valid": true,
                "resource_type": "dns_record"
            },
            {
                "type": "CNAME",
                "domain": "s1._domainkey.brewfictus.com",
                "expected_value": "s1._domainkey.kayako.com",
                "actual_values": [
                    "s1._domainkey.kayako.com"
                ],
                "is_valid": true,
                "resource_type": "dns_record"
            },
            {
                "type": "CNAME",
                "domain": "s2._domainkey.brewfictus.com",
                "expected_value": "s2._domainkey.kayako.com",
                "actual_values": [
                    "s2._domainkey.kayako.com"
                ],
                "is_valid": true,
                "resource_type": "dns_record"
            }
        ],
        "resource_type": "mailbox_configuration"
    },
    "resource": "mailbox_configuration"
}
```

## Add a mailbox

POST**/api/v1/mailboxes.json**

### Information

Allowed for Admins & Owners

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| address | string |  |  |
| brand_id | integer |  | If not specified, default [brand](https://developer.kayako.com/api/v1/general/brands/) is set to the mailbox |
| is_default | boolean |  | **Default:**`false` |

### Response

```
{
    "status": 201,
    "data": {
        "id": 1,
        "uuid": "d2e7d14a-2db0-4af4-81f2-50801bdb6dd9",
        "address": "support@brewfictus.com",
        "brand": {
            "id": 1,
            "resource_type": "brand"
        },
        "is_system": true,
        "is_custom": true,
        "is_verified": true,
        "is_default": true,
        "is_enabled": true,
        "is_deleted": false,
        "verified_at": "2015-07-02T07:28:25+05:00",
        "created_at": "2015-08-18T17:45:49+05:00",
        "updated_at": "2015-08-18T17:45:49+05:00",
        "resource_type": "mailbox",
        "resource_url": "https://brewfictus.kayako.com/api/v1/mailboxes/1"
    },
    "resource": "mailbox"
}
```

## Update a mailbox

PUT**/api/v1/mailboxes/:id.json**

### Information

Allowed for Admins & Owners

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| brand_id | integer |  |  |
| is_enabled | boolean |  |  |
| is_default | boolean |  |  |

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "uuid": "d2e7d14a-2db0-4af4-81f2-50801bdb6dd9",
        "address": "support@brewfictus.com",
        "brand": {
            "id": 1,
            "resource_type": "brand"
        },
        "is_system": true,
        "is_custom": true,
        "is_verified": true,
        "is_default": true,
        "is_enabled": true,
        "is_deleted": false,
        "verified_at": "2015-07-02T07:28:25+05:00",
        "created_at": "2015-08-18T17:45:49+05:00",
        "updated_at": "2015-08-18T17:45:49+05:00",
        "resource_type": "mailbox",
        "resource_url": "https://brewfictus.kayako.com/api/v1/mailboxes/1"
    },
    "resource": "mailbox"
}
```

## Update mailboxes

PUT**/api/v1/mailboxes.json**

### Information

Allowed for Admins & Owners

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| is_enabled | boolean |  |  |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```

## Mark as default

PUT**/api/v1/mailboxes/default.json**

### Information

Allowed for Admins & Owners

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| mailbox_id | integer |  |  |

### Response

```
{
    "status": 200
}
```

## Delete a mailbox

DELETE**/api/v1/mailboxes/:id.json**

### Information

Allowed for Admins & Owners

### Response

```
{
    "status": 200
}
```

## Delete mailboxes

DELETE**/api/v1/mailboxes.json**

### Information

Allowed for Admins & Owners

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```




### Mails

Title: Mails - Mail | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/mail/mails/

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   CHANNELS
4.   MAIL

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| from | string |  |  |
| to | string |  |  |
| sender | [User](https://developer.kayako.com/api/v1/users/users/) |  |  |
| subject | string |  |  |
| source | string |  |  |
| text | string |  |  |
| html | string |  |  |
| status | string |  | `RECEIVED`, `PROCESSING`, `SUCCESS` , `FAILED`, `REJECTED`, `SUSPENDED` |
| suspension_code | string |  | `INVALID_CASE_TOKEN`, `UNREGISTERED_USER`, `UNVERIFIED_EMAIL` , `NOT_PARTICIPANT`, `NO_FROM_ADDRESS`, `AUTOMATED_EMAIL`, `BLOCKLISTED_EMAIL`, `DELIVERY_FAILED`, `LOOP_DETECTED`, `SOURCE_IS_MAILBOX`, `MAILER_DAEMON`, `SOURCE_IS_NOREPLY`, `OUT_OF_OFFICE_EMAIL`, `SPAM`, `INVALID_EMAIL_HEADERS`, `INVALID_FROM_ADDRESS` |
| reason | string |  |  |
| message_id | string |  | Message ID of email |
| size | string |  |  |
| mailbox | [Mailbox](https://developer.kayako.com/api/v1/mail/mailboxes/) |  |  |
| case | [Case](https://developer.kayako.com/api/v1/cases/cases/) |  |  |
| case_post | [Message](https://developer.kayako.com/api/v1/cases/cases/#Messages) |  |  |
| time_taken | integer |  |  |
| is_suspended | boolean |  |  |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| completed_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve all mails

GET**/api/v1/mails.json**

### Information

Allowed for Collaborators, Agents & Admins

Only suspended mails are allowed to agents and collaborators.

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| is_suspended | boolean |  | Whether to return mails that are suspended. **Allowed values:**`true`, `false` |

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "from": "caryn.pryor@atmospherecoffeeinc.com",
            "to": "support@brewfictus.kayako.com",
            "sender": {
                "id": 2,
                "resource_type": "user"
            },
            "subject": "Can I change the delivery address of my order?",
            "source": "\nMIME-Version: 1.0\nReceived: by 10.27.132.196 with HTTP; Thu, 2 Jul 2015 09:37:20 -0700 (PDT)\nDate: Thu, 2 Jul 2015 22:07:20 +0530\nDelivered-To: caryn.pryor@atmospherecoffeeinc.com\nMessage-ID: <CAAX98m6PjhWWDTERj36JtpXasmuRB5f0qUaqVr6caR0PZFc4uQ@mail.gmail.com>\nSubject: Can I change the delivery address of my order?\nFrom: Caryn Pryor <caryn.pryor@atmospherecoffeeinc.com>\nTo: support@brewfictus.kayako.com\nContent-Type: text/plain; charset=UTF-8\n\nHi,\n\nI have just placed an order for two coffees. Can I change the delivery\naddress of my order?\n\n--\nThanks\nCaryn Pryor\n",
            "text": "Hi,\n\nI have just placed an order for two coffees. Can I change the delivery\naddress of my order?\n\n--\nThanks\nCaryn Pryor\n",
            "html": null,
            "status": "SUSPENDED",
            "suspension_code": null,
            "reason": null,
            "message_id": "CAAX98m6PjhWWDTERj36JtpXasmuRB5f0qUaqVr6caR0PZFc4uQ@mail.gmail.com",
            "size": 569,
            "mailbox": {
                "id": 1,
                "resource_type": "mailbox"
            },
            "case": {
                "id": 1,
                "resource_type": "case"
            },
            "case_message": {
                "id": 1,
                "resource_type": "case_message"
            },
            "time_taken": 0,
            "is_suspended": true,
            "created_at": "2015-07-02T16:38:11+05:00",
            "completed_at": "2015-07-02T16:38:11+05:00",
            "resource_type": "mail",
            "resource_url": "https://brewfictus.kayako.com/api/v1/mails/1"
        }
    ],
    "resource": "mail",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Retrieve a mail

GET**/api/v1/mails/:id.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners

If there is a case linked with the mail, then the permission depends on case accessibility. However, suspended mail is allowed to all.

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "from": "caryn.pryor@atmospherecoffeeinc.com",
        "to": "support@brewfictus.kayako.com",
        "sender": {
            "id": 2,
            "resource_type": "user"
        },
        "subject": "Can I change the delivery address of my order?",
        "source": "\nMIME-Version: 1.0\nReceived: by 10.27.132.196 with HTTP; Thu, 2 Jul 2015 09:37:20 -0700 (PDT)\nDate: Thu, 2 Jul 2015 22:07:20 +0530\nDelivered-To: caryn.pryor@atmospherecoffeeinc.com\nMessage-ID: <CAAX98m6PjhWWDTERj36JtpXasmuRB5f0qUaqVr6caR0PZFc4uQ@mail.gmail.com>\nSubject: Can I change the delivery address of my order?\nFrom: Caryn Pryor <caryn.pryor@atmospherecoffeeinc.com>\nTo: support@brewfictus.kayako.com\nContent-Type: text/plain; charset=UTF-8\n\nHi,\n\nI have just placed an order for two coffees. Can I change the delivery\naddress of my order?\n\n--\nThanks\nCaryn Pryor\n",
        "text": "Hi,\n\nI have just placed an order for two coffees. Can I change the delivery\naddress of my order?\n\n--\nThanks\nCaryn Pryor\n",
        "html": null,
        "status": "SUSPENDED",
        "suspension_code": null,
        "reason": null,
        "message_id": "CAAX98m6PjhWWDTERj36JtpXasmuRB5f0qUaqVr6caR0PZFc4uQ@mail.gmail.com",
        "size": 569,
        "mailbox": {
            "id": 1,
            "resource_type": "mailbox"
        },
        "case": {
            "id": 1,
            "resource_type": "case"
        },
        "case_message": {
            "id": 1,
            "resource_type": "case_message"
        },
        "time_taken": 0,
        "is_suspended": true,
        "created_at": "2015-07-02T16:38:11+05:00",
        "completed_at": "2015-07-02T16:38:11+05:00",
        "resource_type": "mail",
        "resource_url": "https://brewfictus.kayako.com/api/v1/mails/1"
    },
    "resource": "mail"
}
```

## Process a mail

PUT**/api/v1/mails/:id.json**

### Information

Allowed for Agents, Admins & Owners

Only suspended mails are allowed for this action.

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| is_suspended | boolean |  | **Allowed value:**`false` |

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "from": "caryn.pryor@atmospherecoffeeinc.com",
        "to": "support@brewfictus.kayako.com",
        "sender": {
            "id": 2,
            "resource_type": "user"
        },
        "subject": "Can I change the delivery address of my order?",
        "source": "\nMIME-Version: 1.0\nReceived: by 10.27.132.196 with HTTP; Thu, 2 Jul 2015 09:37:20 -0700 (PDT)\nDate: Thu, 2 Jul 2015 22:07:20 +0530\nDelivered-To: caryn.pryor@atmospherecoffeeinc.com\nMessage-ID: <CAAX98m6PjhWWDTERj36JtpXasmuRB5f0qUaqVr6caR0PZFc4uQ@mail.gmail.com>\nSubject: Can I change the delivery address of my order?\nFrom: Caryn Pryor <caryn.pryor@atmospherecoffeeinc.com>\nTo: support@brewfictus.kayako.com\nContent-Type: text/plain; charset=UTF-8\n\nHi,\n\nI have just placed an order for two coffees. Can I change the delivery\naddress of my order?\n\n--\nThanks\nCaryn Pryor\n",
        "text": "Hi,\n\nI have just placed an order for two coffees. Can I change the delivery\naddress of my order?\n\n--\nThanks\nCaryn Pryor\n",
        "html": null,
        "status": "SUSPENDED",
        "suspension_code": null,
        "reason": null,
        "message_id": "CAAX98m6PjhWWDTERj36JtpXasmuRB5f0qUaqVr6caR0PZFc4uQ@mail.gmail.com",
        "size": 569,
        "mailbox": {
            "id": 1,
            "resource_type": "mailbox"
        },
        "case": {
            "id": 1,
            "resource_type": "case"
        },
        "case_message": {
            "id": 1,
            "resource_type": "case_message"
        },
        "time_taken": 0,
        "is_suspended": true,
        "created_at": "2015-07-02T16:38:11+05:00",
        "completed_at": "2015-07-02T16:38:11+05:00",
        "resource_type": "mail",
        "resource_url": "https://brewfictus.kayako.com/api/v1/mails/1"
    },
    "resource": "mail"
}
```

## Process mails

PUT**/api/v1/mails.json**

### Information

Allowed for Agents, Admins & Owners

Only suspended mails are allowed for this action.

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| is_suspended | boolean |  | **Allowed value:**`false` |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```

## Delete a mail

DELETE**/api/v1/mails/:id.json**

### Information

Allowed for Agents & Admins

Only suspended mails are allowed for this action.

### Response

```
{
    "status": 200
}
```

## Delete mails

DELETE**/api/v1/mails.json**

### Information

Allowed for Agents, Admins & Owners

Only suspended mails are allowed for this action.

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```




---

## Channels / Event


### Events

Title: Events - Event | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/event/events/

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   CHANNELS
4.   EVENT

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| uuid | string |  |  |
| event | string |  |  |
| user | [User](https://developer.kayako.com/api/v1/event/events/#user) |  |  |
| properties | array |  | Properties will be in key - value pair |
| triggered_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## User

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| uuid | string |  |  |
| full_name | integer |  |  |
| role | [Role](https://developer.kayako.com/api/v1/users/roles/) |  |  |
| teams | [Team](https://developer.kayako.com/api/v1/users/teams/) |  |  |
| avatar | string |  |  |
| last_active_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| last_seen_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| last_activity_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Incoming webhook

POST**/api/v1/webhook/:token/incoming.json**

### Information

Allowed for Public

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| event | string |  | Allowed characters are `[a-Z]`, `_`, `.` and `whitespace` |
| user | json |  | We accept the following keys `email`, `phone`, `twitter_id`, `facebook_id`, `external_id` and `full_name`. At least one identity is mandatory to specify. **Note:** For `external_id`, `external_app` name (like SalesForce, SugarCRM) is mandatory to pass because id could be same for two or more external apps. We will check for an existing user in Kayako in a pre-defined order (which prioritises email over phone and phone over social networks). On a positive match, we will attribute event to user's identity. If no match is found against any provided attribute, we will add a new user using the provided attributes. _full\_name_ will be useful to create new user. **Example:** `{"email":"joy@brewfictus.com", "phone":"+4567798989", "full_name":"joy"}` |
| properties | json |  | We accept the properties in Key - Value pair We provide a few pre-defined keys `url`, `icon_url`, `summary`, `color` and `source` that are reserved and is intended to standardise event record and display. **_url:_** should be a valid url **_icon\_url:_** should be a valid https url **_summary:_** should be a string to describe your event. Will be used to headline event in Kayako **_color:_** should be valid hexadecimal code **_source:_** source of the event - should be non-numeric and can only contain underscore and dot. **Default:**`CUSTOM` You can always add a new key - value pair. **Example:** `{"accountID":"A/C-51434376767", "type":"meeting"}` |
| triggered_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) timestamp |

### Request

### Response

```
{
    "status": 201,
    "data": {
        "id": 1,
        "uuid": "a29dfad1-0638-414b-acaf-ee128473386b",
        "event": "click_priing",
        "user": {
            "id": 1,
            "resource_type": "user_minimal"
        },
        "properties": {
            "url": "https://www.salesforce.com",
            "icon_url": "https://c2.sfdcstatic.com/content/dam/web/en_is/www/images/logo/logo-company.png",
            "source": "CUSTOM",
            "accountID": "A/C 51434376767",
            "type": "meeting"
        },
        "triggered_at": "2015-07-29T00:00:47+05:00",
        "created_at": "2015-07-29T00:05:41+05:00",
        "resource_type": "event"
    },
    "resource": "event"
}
```

## Bulk Incoming webhook

POST**/api/v1/bulk/webhook/:token/incoming.json**

### Information

Allowed for Public

You can insert a maximum of 200 events at a time

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| events | array |  | Array of events to be inserted |

### Request

```
curl -X POST https://brewfictus.kayako.com/api/v1/bulk/webhook/6LrzlgNlPAw6NxlLNy7Ua0qhIWbNenSI6Xsq4MEtY0moPeEdBFmTJ0cs7eoHprpU/incoming \
    -d '{ "events": [{ "event": "click_pricing", "properties": { "url": "https://www.salesforce.com", "icon_url": "https://c2.sfdcstatic.com/content/dam/web/en_is/www/images/logo/logo-company.png", "accountID": "A/C 51434376767", "type": "meeting" }, "user": { "email": "joy@brewfictus.com", "full_name": "Joy" } }, { "event": "click_buy", "properties": { "url": "https://www.salesforce.com", "icon_url": "https://c2.sfdcstatic.com/content/dam/web/en_is/www/images/logo/logo-company.png", "accountID": "A/C 51434376790", "type": "customer" }, "user": { "email": "happy@brewfictus.com", "full_name": "Happy" } } ] }' \
    -H "Content-Type: application/json"
```

### Response

```
{
    "status": 201
}
```




### Tokens

Title: Tokens - Event | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/event/tokens/

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   CHANNELS
4.   EVENT

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| label | string |  |  |
| description | string |  |  |
| channel | string |  |  |
| token | string |  |  |
| webhook_url | string |  |  |
| icon | [Attachment](https://developer.kayako.com/api/v1/event/tokens/#attachments) |  |  |
| is_enabled | boolean |  | **Default:**`true` |
| lastused_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Attachments

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| size | integer |  |  |
| width | integer |  | Only if the attachment is image |
| height | integer |  | Only if the attachment is image |
| type | string |  | Mime-type of the file |
| content_id | string |  | Content ID used for inline attachment |
| alt | string |  |  |
| url | string |  | The URL to view the attachment |
| url_download | string |  | The URL to download the attachment |
| thumbnails | [Thumbnails](https://developer.kayako.com/api/v1/event/tokens/#thumbnails) |  |  |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Thumbnails

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| size | integer |  |  |
| width | integer |  |  |
| height | integer |  |  |
| type | string |  | Mime-type of the file |
| url | string |  | The URL to view the thumbnail |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve all tokens

GET**/api/v1/events/tokens.json**

### Information

Allowed for Admins & Owners
Ordered by id (ascending)

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "label": "sales force",
            "description": "This is posted to case and comes from sales force",
            "channel": "EVENT",
            "token": "hK1nLnvFNXJW5euvcZPfZD8WnP2kT5jdhz0T7oVgzNiPXfLjertMvYfkAm2F0COR",
            "webhook_url": "https://brewfictus.kayako.com/api/v1/webhook/8xNirozibd9aFmQzaRZ3EpKDl6hz4iMjRYk1K7QRr2sGUdun5nCTLKF57HRnH4m2/incoming",
            "icon": null,
            "is_enabled": true,
            "lastused_at": null,
            "created_at": "2015-07-28T23:46:17+05:00",
            "updated_at": "2015-07-28T23:46:17+05:00",
            "resource_type": "token",
            "resource_url": "https://brewfictus.kayako.com/api/v1/events/tokens/1"
        }
    ],
    "resource": "token",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Retrieve a token

GET**/api/v1/events/tokens/:id.json**

### Information

Allowed for Admins & Owners

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "label": "sales force",
        "description": "This is posted to case and comes from sales force",
        "channel": "EVENT",
        "token": "hK1nLnvFNXJW5euvcZPfZD8WnP2kT5jdhz0T7oVgzNiPXfLjertMvYfkAm2F0COR",
        "webhook_url": "https://brewfictus.kayako.com/api/v1/webhook/8xNirozibd9aFmQzaRZ3EpKDl6hz4iMjRYk1K7QRr2sGUdun5nCTLKF57HRnH4m2/incoming",
        "icon": null,
        "is_enabled": true,
        "lastused_at": null,
        "created_at": "2015-07-28T23:46:17+05:00",
        "updated_at": "2015-07-28T23:46:17+05:00",
        "resource_type": "token",
        "resource_url": "https://brewfictus.kayako.com/api/v1/events/tokens/1"
    },
    "resource": "token"
}
```

## Add a token

POST**/api/v1/events/tokens.json**

### Information

Allowed for Admins & Owners

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| label | string |  |  |
| description | string |  |  |
| channel | string |  | **Default:**`EVENT` |
| icon | multipart/form-data |  | File upload |
| is_enabled | boolean |  | **Default:**`true` |

### Response

```
{
    "status": 201,
    "data": {
        "id": 1,
        "label": "sales force",
        "description": "This is posted to case and comes from sales force",
        "channel": "EVENT",
        "token": "hK1nLnvFNXJW5euvcZPfZD8WnP2kT5jdhz0T7oVgzNiPXfLjertMvYfkAm2F0COR",
        "webhook_url": "https://brewfictus.kayako.com/api/v1/webhook/8xNirozibd9aFmQzaRZ3EpKDl6hz4iMjRYk1K7QRr2sGUdun5nCTLKF57HRnH4m2/incoming",
        "icon": null,
        "is_enabled": true,
        "lastused_at": null,
        "created_at": "2015-07-28T23:46:17+05:00",
        "updated_at": "2015-07-28T23:46:17+05:00",
        "resource_type": "token",
        "resource_url": "https://brewfictus.kayako.com/api/v1/events/tokens/1"
    },
    "resource": "token"
}
```

## Update a token

PUT**/api/v1/events/tokens/:id.json**

### Information

Allowed for Admins & Owners

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| label | string |  |  |
| description | string |  |  |
| icon | multipart/form-data |  | File upload |
| is_enabled | boolean |  |  |

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "label": "sales force",
        "description": "This is posted to case and comes from sales force",
        "channel": "EVENT",
        "token": "hK1nLnvFNXJW5euvcZPfZD8WnP2kT5jdhz0T7oVgzNiPXfLjertMvYfkAm2F0COR",
        "webhook_url": "https://brewfictus.kayako.com/api/v1/webhook/8xNirozibd9aFmQzaRZ3EpKDl6hz4iMjRYk1K7QRr2sGUdun5nCTLKF57HRnH4m2/incoming",
        "icon": null,
        "is_enabled": true,
        "lastused_at": null,
        "created_at": "2015-07-28T23:46:17+05:00",
        "updated_at": "2015-07-28T23:46:17+05:00",
        "resource_type": "token",
        "resource_url": "https://brewfictus.kayako.com/api/v1/events/tokens/1"
    },
    "resource": "token"
}
```

## Update tokens

PUT**/api/v1/events/tokens.json**

### Information

Allowed for Admins & Owners

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| is_enabled | boolean |  |  |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```

## Delete a token

DELETE**/api/v1/events/tokens/:id.json**

### Information

Allowed for Admins & Owners

### Response

```
{
    "status": 200
}
```

## Delete tokens

DELETE**/api/v1/events/tokens.json**

### Information

Allowed for Admins & Owners

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```




---

## Channels / Help Center


### Articles

Title: Articles - Help Center | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/help_center/articles/

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   CHANNELS
4.   HELP CENTER

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| uuid | string |  |  |
| legacy_id | string |  |  |
| titles | [Field Locales](https://developer.kayako.com/api/v1/general/field_locales/) |  |  |
| slugs | [Field Locales](https://developer.kayako.com/api/v1/general/field_locales/) |  |  |
| contents | [Field Locales](https://developer.kayako.com/api/v1/general/field_locales/) |  |  |
| keywords | string |  | List of extra words and phrases which you think your customers may search for to find this article. It will increase the likelihood of this article appearing in searches that include these words and phrases. |
| section | [Section](https://developer.kayako.com/api/v1/help_center/sections/) |  |  |
| creator | [User](https://developer.kayako.com/api/v1/users/users/) |  |  |
| author | [User](https://developer.kayako.com/api/v1/users/users/) |  |  |
| attachments | [Attachments](https://developer.kayako.com/api/v1/help_center/articles/#Attachments) |  |  |
| download_all | string |  |  |
| status | string |  | `PUBLISHED`, `DRAFT`, `PENDINGAPPROVAL` **Default:**`DRAFT` |
| upvote_count | integer |  |  |
| downvote_count | integer |  |  |
| views | integer |  |  |
| rank | float |  |  |
| tags | [Tags](https://developer.kayako.com/api/v1/help_center/articles/#tags) |  |  |
| is_featured | boolean |  | **Default:**`false` |
| allow_comments | boolean |  | **Default:**`true` |
| total_comments | integer |  |  |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| published_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| helpcenter_url | string |  | The helpcenter url of the article |

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |

## Retrieve all articles

GET**/api/v1/articles.json**

### Information

Allowed for Public

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| section_id | integer |  |  |
| tags | string |  | Comma separated tags |
| filter | string |  | `PINNED`, `PUBLISHED` |

**OR**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| legacy_ids | string |  | The comma separated legacy ids |

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "legacy_id": null,
            "uuid": "44afa976-5041-57d2-820e-55ab43c4c6b9",
            "titles": [
                {
                    "id": 1,
                    "resource_type": "locale_field"
                }
            ],
            "slugs": [
                {
                    "locale": "en-us",
                    "translation": "1-v60-pour-over-brewing",
                    "resource_type": "slug"
                }
            ],
            "contents": [
                {
                    "id": 1,
                    "resource_type": "locale_field"
                }
            ],
            "keywords": null,
            "section": {
                "id": 1,
                "resource_type": "section"
            },
            "creator": {
                "id": 1,
                "resource_type": "user_minimal"
            },
            "author": {
                "id": 1,
                "resource_type": "user_minimal"
            },
            "attachments": [],
            "download_all": null,
            "status": "PUBLISHED",
            "upvote_count": 0,
            "downvote_count": 0,
            "views": 0,
            "rank": 0,
            "tags": [],
            "is_featured": true,
            "allow_comments": true,
            "total_comments": 0,
            "created_at": "2016-04-13T07:32:51+00:00",
            "published_at": "2016-04-13T07:32:51+00:00",
            "updated_at": "2016-04-13T07:32:51+00:00",
            "helpcenter_url": "https://brewfictus.kayako.com/article/1",
            "resource_type": "article",
            "resource_url": "https://brewfictus.kayako.com/api/v1/articles/1"
        }
    ],
    "resource": "article",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Retrieve an article

GET**/api/v1/articles/:id.json**

### Information

Allowed for Public

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "legacy_id": null,
        "uuid": "44afa976-5041-57d2-820e-55ab43c4c6b9",
        "titles": [
            {
                "id": 1,
                "resource_type": "locale_field"
            }
        ],
        "slugs": [
            {
                "locale": "en-us",
                "translation": "1-v60-pour-over-brewing",
                "resource_type": "slug"
            }
        ],
        "contents": [
            {
                "id": 1,
                "resource_type": "locale_field"
            }
        ],
        "keywords": null,
        "section": {
            "id": 1,
            "resource_type": "section"
        },
        "creator": {
            "id": 1,
            "resource_type": "user_minimal"
        },
        "author": {
            "id": 1,
            "resource_type": "user_minimal"
        },
        "attachments": [],
        "download_all": null,
        "status": "PUBLISHED",
        "upvote_count": 0,
        "downvote_count": 0,
        "views": 0,
        "rank": 0,
        "tags": [],
        "is_featured": true,
        "allow_comments": true,
        "total_comments": 0,
        "created_at": "2016-04-13T07:32:51+00:00",
        "published_at": "2016-04-13T07:32:51+00:00",
        "updated_at": "2016-04-13T07:32:51+00:00",
        "helpcenter_url": "https://brewfictus.kayako.com/article/1",
        "resource_type": "article",
        "resource_url": "https://brewfictus.kayako.com/api/v1/articles/1"
    },
    "resource": "article"
}
```

## Retrieve popular articles

GET**/api/v1/categories/:id/populararticles.json**

### Information

Allowed for Public

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "legacy_id": null,
            "uuid": "44afa976-5041-57d2-820e-55ab43c4c6b9",
            "titles": [
                {
                    "id": 1,
                    "resource_type": "locale_field"
                }
            ],
            "slugs": [
                {
                    "locale": "en-us",
                    "translation": "1-v60-pour-over-brewing",
                    "resource_type": "slug"
                }
            ],
            "contents": [
                {
                    "id": 1,
                    "resource_type": "locale_field"
                }
            ],
            "keywords": null,
            "section": {
                "id": 1,
                "resource_type": "section"
            },
            "creator": {
                "id": 1,
                "resource_type": "user_minimal"
            },
            "author": {
                "id": 1,
                "resource_type": "user_minimal"
            },
            "attachments": [],
            "download_all": null,
            "status": "PUBLISHED",
            "upvote_count": 0,
            "downvote_count": 0,
            "views": 0,
            "rank": 0,
            "tags": [],
            "is_featured": true,
            "allow_comments": true,
            "total_comments": 0,
            "created_at": "2016-04-13T07:32:51+00:00",
            "published_at": "2016-04-13T07:32:51+00:00",
            "updated_at": "2016-04-13T07:32:51+00:00",
            "helpcenter_url": "https://brewfictus.kayako.com/article/1",
            "resource_type": "article",
            "resource_url": "https://brewfictus.kayako.com/api/v1/articles/1"
        }
    ],
    "resource": "article",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Retrieve related articles

GET**/api/v1/articles/:id/related.json**

### Information

Allowed for Public

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| locale | string |  |  |

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "legacy_id": null,
            "uuid": "44afa976-5041-57d2-820e-55ab43c4c6b9",
            "titles": [
                {
                    "id": 1,
                    "resource_type": "locale_field"
                }
            ],
            "slugs": [
                {
                    "locale": "en-us",
                    "translation": "1-v60-pour-over-brewing",
                    "resource_type": "slug"
                }
            ],
            "contents": [
                {
                    "id": 1,
                    "resource_type": "locale_field"
                }
            ],
            "keywords": null,
            "section": {
                "id": 1,
                "resource_type": "section"
            },
            "creator": {
                "id": 1,
                "resource_type": "user_minimal"
            },
            "author": {
                "id": 1,
                "resource_type": "user_minimal"
            },
            "attachments": [],
            "download_all": null,
            "status": "PUBLISHED",
            "upvote_count": 0,
            "downvote_count": 0,
            "views": 0,
            "rank": 0,
            "tags": [],
            "is_featured": true,
            "allow_comments": true,
            "total_comments": 0,
            "created_at": "2016-04-13T07:32:51+00:00",
            "published_at": "2016-04-13T07:32:51+00:00",
            "updated_at": "2016-04-13T07:32:51+00:00",
            "helpcenter_url": "https://brewfictus.kayako.com/article/1",
            "resource_type": "article",
            "resource_url": "https://brewfictus.kayako.com/api/v1/articles/1"
        }
    ],
    "resource": "article",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Add an article

POST**/api/v1/articles.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners

Collaborators can add an article only with DRAFT status

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| titles | string |  |  |
| contents | string |  |  |
| legacy_id | string |  |  |
| section_id | integer |  |  |
| author_id | integer |  |  |
| keywords | string |  |  |
| status | string |  | `PUBLISHED`, `DRAFT`, `PENDINGAPPROVAL` **Default:**`DRAFT` |
| is_featured | boolean |  | **Default:**`false` |
| allow_comments | boolean |  | **Default:**`true` |
| tags | string |  | Comma separated value of tag names |
| files | array |  | File Upload multipart/form-data |
| attachment_file_ids | CSV |  |  |

### Request

```
curl -X POST https://brewfictus.kayako.com/api/v1/articles.json \
    -d '{"titles":[{"locale":"en-us", "translation": "V60 pour over brewing"}], "contents":[{"locale":"en-us", "translation": "V60 pour over brewing..."}],"section_id":1,"author_id":1,"status":"PUBLISHED","allow_comments":true}' \
    -H "Content-Type: application/json" \
    -u "jordan.mitchell@brewfictus.com:jmit6#lsXo"
```

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "legacy_id": null,
        "uuid": "44afa976-5041-57d2-820e-55ab43c4c6b9",
        "titles": [
            {
                "id": 1,
                "resource_type": "locale_field"
            }
        ],
        "slugs": [
            {
                "locale": "en-us",
                "translation": "1-v60-pour-over-brewing",
                "resource_type": "slug"
            }
        ],
        "contents": [
            {
                "id": 1,
                "resource_type": "locale_field"
            }
        ],
        "keywords": null,
        "section": {
            "id": 1,
            "resource_type": "section"
        },
        "creator": {
            "id": 1,
            "resource_type": "user_minimal"
        },
        "author": {
            "id": 1,
            "resource_type": "user_minimal"
        },
        "attachments": [],
        "download_all": null,
        "status": "PUBLISHED",
        "upvote_count": 0,
        "downvote_count": 0,
        "views": 0,
        "rank": 0,
        "tags": [],
        "is_featured": true,
        "allow_comments": true,
        "total_comments": 0,
        "created_at": "2016-04-13T07:32:51+00:00",
        "published_at": "2016-04-13T07:32:51+00:00",
        "updated_at": "2016-04-13T07:32:51+00:00",
        "helpcenter_url": "https://brewfictus.kayako.com/article/1",
        "resource_type": "article",
        "resource_url": "https://brewfictus.kayako.com/api/v1/articles/1"
    },
    "resource": "article"
}
```

## Bulk add articles

POST**/api/v1/bulk/articles.json**

### Information

Allowed for Agents, Admins & Owners

You can insert a maximum of 200 articles at a time

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| articles | array |  | Array of articles to be inserted |

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| partial_import | boolean |  | By default, even if a single record is invalid, the entire batch is dropped. However, if this parameter is set to `true`, all the records with no validation errors will be inserted while the invalid records will be returned back. |

### Request

```
curl -X POST https://brewfictus.kayako.com/api/v1/bulk/articles \
    -d '{"articles": [{"titles": [{"locale": "en-us", "translation": "Sample Article"}], "section_id": 1, "author_id": 1, "contents": [{"locale": "en-us", "translation": "Sample Contents"}],"legacy_id":"article_1"}]}' \
    -H "Content-Type: application/json"
```

### Response

```
{
    "status": 202,
    "data": {
        "id": 1,
        "status": "PENDING",
        "created_at": "2015-07-30T06:45:25+05:00",
        "updated_at": "2015-07-30T06:45:25+05:00",
        "resource_type": "bulk_job",
        "resource_url": "https://brewfictus.kayako.com/api/v1/jobs/1"
    },
    "resource": "job"
}
```

## Update an article

PUT**/api/v1/articles/:id.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners

Collaborators can update an article only with DRAFT status

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| titles | string |  |  |
| contents | string |  |  |
| keywords | string |  |  |
| section_id | integer |  |  |
| author_id | integer |  |  |
| status | string |  | `PUBLISHED`, `DRAFT`, `PENDINGAPPROVAL` |
| is_featured | boolean |  |  |
| allow_comments | boolean |  |  |
| files | array |  | File Upload multipart/form-data |
| tags | string |  | Comma separated value of tag names |

### Request

```
curl -X PUT https://brewfictus.kayako.com/api/v1/articles/1.json \
    -d '{"titles":[{"locale":"en-us", "translation": "V60 pour over brewing"}], "contents":[{"locale":"en-us", "translation": "V60 pour over brewing..."}],"section_id":1,"author_id":1,"status":"PUBLISHED","allow_comments":true}' \
    -H "Content-Type: application/json" \
    -u "jordan.mitchell@brewfictus.com:jmit6#lsXo"
```

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "legacy_id": null,
        "uuid": "44afa976-5041-57d2-820e-55ab43c4c6b9",
        "titles": [
            {
                "id": 1,
                "resource_type": "locale_field"
            }
        ],
        "slugs": [
            {
                "locale": "en-us",
                "translation": "1-v60-pour-over-brewing",
                "resource_type": "slug"
            }
        ],
        "contents": [
            {
                "id": 1,
                "resource_type": "locale_field"
            }
        ],
        "keywords": null,
        "section": {
            "id": 1,
            "resource_type": "section"
        },
        "creator": {
            "id": 1,
            "resource_type": "user_minimal"
        },
        "author": {
            "id": 1,
            "resource_type": "user_minimal"
        },
        "attachments": [],
        "download_all": null,
        "status": "PUBLISHED",
        "upvote_count": 0,
        "downvote_count": 0,
        "views": 0,
        "rank": 0,
        "tags": [],
        "is_featured": true,
        "allow_comments": true,
        "total_comments": 0,
        "created_at": "2016-04-13T07:32:51+00:00",
        "published_at": "2016-04-13T07:32:51+00:00",
        "updated_at": "2016-04-13T07:32:51+00:00",
        "helpcenter_url": "https://brewfictus.kayako.com/article/1",
        "resource_type": "article",
        "resource_url": "https://brewfictus.kayako.com/api/v1/articles/1"
    },
    "resource": "article"
}
```

## Update articles

PUT**/api/v1/articles.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners

Collaborators can update an article only with DRAFT status

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| section_id | integer |  |  |
| author_id | integer |  |  |
| status | string |  | `PUBLISHED`, `DRAFT`, `PENDINGAPPROVAL` |
| is_featured | boolean |  |  |
| allow_comments | boolean |  |  |
| files | array |  | File Upload multipart/form-data |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```

## Votes

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| type | string |  | `HELPFUL`, `NOT_HELPFUL` |
| user | [User](https://developer.kayako.com/api/v1/users/users/) |  |  |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve all votes

GET**/api/v1/articles/:id/votes.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners
Ordered by id (descending)

Customer can retrieve own votes only

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| filter | string |  | `HELPFUL`, `NOT_HELPFUL` |

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "type": "HELPFUL",
            "user": {
                "id": 2,
                "resource_type": "user_minimal"
            },
            "created_at": "2015-08-04T11:28:03+05:00",
            "updated_at": "2015-08-04T11:28:03+05:00",
            "resource_type": "vote",
            "resource_url": "https://brewfictus.kayako.com/api/v1/articles/1/votes/1"
        }
    ],
    "resource": "vote",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Retrieve a vote

GET**/api/v1/articles/:id/votes/:id.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

Customer can retrieve own vote only

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "type": "HELPFUL",
        "user": {
            "id": 2,
            "resource_type": "user_minimal"
        },
        "created_at": "2015-08-04T11:28:03+05:00",
        "updated_at": "2015-08-04T11:28:03+05:00",
        "resource_type": "vote",
        "resource_url": "https://brewfictus.kayako.com/api/v1/articles/1/votes/1"
    },
    "resource": "vote"
}
```

## Retrieve vote status

GET**/api/v1/articles/:id/hasvoted.json**

### Information

Allowed for Public

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| user_id | integer |  |  |

### Response, if voted

```
{
    "status": 200,
    "data": {
        "id": 1,
        "type": "HELPFUL",
        "user": {
            "id": 2,
            "resource_type": "user_minimal"
        },
        "created_at": "2015-08-04T11:28:03+05:00",
        "updated_at": "2015-08-04T11:28:03+05:00",
        "resource_type": "vote",
        "resource_url": "https://brewfictus.kayako.com/api/v1/articles/1/votes/1"
    },
    "resource": "vote"
}
```

### Response, if not voted

## Vote as helpful

POST**/api/v1/articles/:id/votes/helpful.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

### Response

```
{
    "status": 201,
    "data": {
        "id": 1,
        "type": "HELPFUL",
        "user": {
            "id": 2,
            "resource_type": "user_minimal"
        },
        "created_at": "2015-08-04T11:28:03+05:00",
        "updated_at": "2015-08-04T11:28:03+05:00",
        "resource_type": "vote",
        "resource_url": "https://brewfictus.kayako.com/api/v1/articles/1/votes/1"
    },
    "resource": "vote"
}
```

## Vote as not helpful

POST**/api/v1/articles/:id/votes/nothelpful.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

### Response

```
{
    "status": 201,
    "data": {
        "id": 1,
        "type": "NOT_HELPFUL",
        "user": {
            "id": 2,
            "resource_type": "user_minimal"
        },
        "created_at": "2015-08-04T11:28:03+05:00",
        "updated_at": "2015-08-04T11:28:03+05:00",
        "resource_type": "vote",
        "resource_url": "https://brewfictus.kayako.com/api/v1/articles/1/votes/1"
    },
    "resource": "vote"
}
```

## Delete a vote

DELETE**/api/v1/articles/:id/votes/:id.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

Customer can delete own vote only

### Response

```
{
    "status": 200
}
```

## Delete votes

DELETE**/api/v1/articles/:id/votes.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```

## Reorder Articles

PUT**/api/v1/articles/reorder.json**

### Information

Allowed for Agents, Admins & Owners

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| article_ids | string |  | Pass the section ids in order you want to set |
| section_id | integer |  |  |

### Response

```
{
    "status": 200
}
```

## Attachments

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| size | integer |  |  |
| width | integer |  | Only if the attachment is image |
| height | integer |  | Only if the attachment is image |
| type | string |  | Mime-type of the file |
| content_id | string |  | Content ID used for inline attachment |
| alt | string |  |  |
| url | string |  | The URL to view the attachment |
| url_download | string |  | The URL to download the attachment |
| thumbnails | [Thumbnails](https://developer.kayako.com/api/v1/help_center/articles/#thumbnails) |  |  |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Thumbnails

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| size | integer |  |  |
| width | integer |  |  |
| height | integer |  |  |
| type | string |  | Mime-type of the file |
| url | string |  | The URL to view the thumbnail |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve all article's attachments

GET**/api/v1/articles/:id/attachments.json**

### Information

Allowed for Public

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "name": "test.jpg",
            "size": 240711,
            "width": 1280,
            "height": 800,
            "type": "image/jpeg",
            "content_id": null,
            "alt": null,
            "url": "https://brewfictus.kayako.com/api/v1/articles/1/attachments/2/url",
            "url_download": "https://brewfictus.kayako.com/api/v1/articles/1/attachments/2/download",
            "thumbnails": [
                {
                    "name": "test.jpg",
                    "size": 4391,
                    "width": 64,
                    "height": 40,
                    "type": "image/jpeg",
                    "url": "https://brewfictus.kayako.com/api/v1/articles/1/attachments/2/url&size=64",
                    "created_at": "2015-07-07T18:03:04+05:00"
                }
            ],
            "created_at": "2015-07-07T18:03:04+05:00",
            "resource_type": "attachment",
            "resource_url": "https://brewfictus.kayako.com/api/v1/articles/1/attachments/1"
        }
    ],
    "resource": "attachment",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Delete an attachment

DELETE**/api/v1/articles/:id/attachments/:id.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners

### Response

```
{
    "status": 200
}
```

## Delete an article

DELETE**/api/v1/articles/:id.json**

### Information

Allowed for Agents, Admins & Owners

### Response

```
{
    "status": 200
}
```

## Delete articles

DELETE**/api/v1/articles.json**

### Information

Allowed for Agents, Admins & Owners

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```

## Search articles

POST**/api/v1/helpcenter/search/articles.json**

### Information

Allowed for Public

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| query | string |  | Character limit should be more than 3 chars |
| locale | string |  |  |
| brand_id | integer |  |  |

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "legacy_id": null,
            "uuid": "44afa976-5041-57d2-820e-55ab43c4c6b9",
            "titles": [
                {
                    "id": 1,
                    "resource_type": "locale_field"
                }
            ],
            "slugs": [
                {
                    "locale": "en-us",
                    "translation": "1-v60-pour-over-brewing",
                    "resource_type": "slug"
                }
            ],
            "contents": [
                {
                    "id": 1,
                    "resource_type": "locale_field"
                }
            ],
            "keywords": null,
            "section": {
                "id": 1,
                "resource_type": "section"
            },
            "creator": {
                "id": 1,
                "resource_type": "user_minimal"
            },
            "author": {
                "id": 1,
                "resource_type": "user_minimal"
            },
            "attachments": [],
            "download_all": null,
            "status": "PUBLISHED",
            "upvote_count": 0,
            "downvote_count": 0,
            "views": 0,
            "rank": 0,
            "tags": [],
            "is_featured": true,
            "allow_comments": true,
            "total_comments": 0,
            "created_at": "2016-04-13T07:32:51+00:00",
            "published_at": "2016-04-13T07:32:51+00:00",
            "updated_at": "2016-04-13T07:32:51+00:00",
            "helpcenter_url": "https://brewfictus.kayako.com/article/1",
            "resource_type": "article",
            "resource_url": "https://brewfictus.kayako.com/api/v1/articles/1"
        }
    ],
    "resource": "article",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```




### Categories

Title: Categories - Help Center | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/help_center/categories/

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   CHANNELS
4.   HELP CENTER

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| titles | [Field Locales](https://developer.kayako.com/api/v1/general/field_locales/) |  |  |
| legacy_id | string |  |  |
| slugs | [Field Locales](https://developer.kayako.com/api/v1/general/field_locales/) |  |  |
| descriptions | [Field Locales](https://developer.kayako.com/api/v1/general/field_locales/) |  |  |
| brand | [Brand](https://developer.kayako.com/api/v1/general/brands/) |  |  |
| display_order | integer |  |  |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve all categories

GET**/api/v1/categories.json**

### Information

Allowed for Public

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| brand_id | integer |  |  |

**OR**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| legacy_ids | string |  | The comma separated legacy ids |

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "legacy_id": null,
            "titles": [
                {
                    "id": 1,
                    "resource_type": "locale_field"
                }
            ],
            "slugs": [
                {
                    "locale": "en-us",
                    "translation": "1-getting-started",
                    "resource_type": "slug"
                }
            ],
            "descriptions": [
                {
                    "id": 1,
                    "resource_type": "locale_field"
                }
            ],
            "brand": {
                "id": 1,
                "name": "Kayako",
                "resource_type": "brand",
                "resource_url": "https://brewfictus.kayako.com/api/v1/brands/1"
            },
            "display_order": 1,
            "created_at": "2016-04-13T07:32:51+00:00",
            "updated_at": "2016-04-13T07:32:51+00:00",
            "resource_type": "category",
            "resource_url": "https://brewfictus.kayako.com/api/v1/categories/1"
        }
    ],
    "resource": "category",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Retrieve a category

GET**/api/v1/categories/:id.json**

### Information

Allowed for Public

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "legacy_id": null,
        "titles": [
            {
                "id": 1,
                "resource_type": "locale_field"
            }
        ],
        "slugs": [
            {
                "locale": "en-us",
                "translation": "1-getting-started",
                "resource_type": "slug"
            }
        ],
        "descriptions": [
            {
                "id": 1,
                "resource_type": "locale_field"
            }
        ],
        "brand": {
            "id": 1,
            "name": "Kayako",
            "resource_type": "brand",
            "resource_url": "https://brewfictus.kayako.com/api/v1/brands/1"
        },
        "display_order": 1,
        "created_at": "2016-04-13T07:32:51+00:00",
        "updated_at": "2016-04-13T07:32:51+00:00",
        "resource_type": "category",
        "resource_url": "https://brewfictus.kayako.com/api/v1/categories/1"
    },
    "resource": "category"
}
```

## Add a category

POST**/api/v1/categories.json**

### Information

Allowed for Agents, Admins & Owners

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| titles | string |  |  |
| legacy_id | string |  |  |
| descriptions | string |  |  |
| brand_id | integer |  |  |

### Request

```
curl -X POST https://brewfictus.kayako.com/api/v1/categories.json \
    -d '{"titles":[{"locale":"en-us", "translation": "Getting started"}], "descriptions":[{"locale":"en-us", "translation": "Getting started description"}],"brand_id":1}' \
    -H "Content-Type: application/json" \
    -u "jordan.mitchell@brewfictus.com:jmit6#lsXo"
```

### Response

```
{
    "status": 201,
    "data": {
        "id": 1,
        "legacy_id": null,
        "titles": [
            {
                "id": 1,
                "resource_type": "locale_field"
            }
        ],
        "slugs": [
            {
                "locale": "en-us",
                "translation": "1-getting-started",
                "resource_type": "slug"
            }
        ],
        "descriptions": [
            {
                "id": 1,
                "resource_type": "locale_field"
            }
        ],
        "brand": {
            "id": 1,
            "name": "Kayako",
            "resource_type": "brand",
            "resource_url": "https://brewfictus.kayako.com/api/v1/brands/1"
        },
        "display_order": 1,
        "created_at": "2016-04-13T07:32:51+00:00",
        "updated_at": "2016-04-13T07:32:51+00:00",
        "resource_type": "category",
        "resource_url": "https://brewfictus.kayako.com/api/v1/categories/1"
    },
    "resource": "category"
}
```

## Bulk add categories

POST**/api/v1/bulk/categories.json**

### Information

Allowed for Agents, Admins & Owners

You can insert a maximum of 200 categories at a time

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| categories | array |  | Array of categories to be inserted |

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| partial_import | boolean |  | By default, even if a single record is invalid, the entire batch is dropped. However, if this parameter is set to `true`, all the records with no validation errors will be inserted while the invalid records will be returned back. |

### Request

```
curl -X POST https://brewfictus.kayako.com/api/v1/bulk/categories \
    -d '{"categories": [{"titles": [{"locale": "en-us", "translation": "Category 1"}], "descriptions": [{"locale": "en-us", "translation": "Category 1"}], "legacy_id": "cat_1", "brand_id": 1}]}' \
    -H "Content-Type: application/json"
```

### Response

```
{
    "status": 202,
    "data": {
        "id": 1,
        "status": "PENDING",
        "created_at": "2015-07-30T06:45:25+05:00",
        "updated_at": "2015-07-30T06:45:25+05:00",
        "resource_type": "bulk_job",
        "resource_url": "https://brewfictus.kayako.com/api/v1/jobs/1"
    },
    "resource": "job"
}
```

## Update a category

PUT**/api/v1/categories/:id.json**

### Information

Allowed for Agents, Admins & Owners

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| titles | string |  |  |
| descriptions | string |  |  |
| brand_id | integer |  |  |

### Request

```
curl -X POST https://brewfictus.kayako.com/api/v1/categories.json \
    -d '{"titles":[{"locale":"en-us", "translation": "Getting started"}], "descriptions":[{"locale":"en-us", "translation": "Getting started description"}],"brand_id":1}' \
    -H "Content-Type: application/json" \
    -u "jordan.mitchell@brewfictus.com:jmit6#lsXo"
```

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "legacy_id": null,
        "titles": [
            {
                "id": 1,
                "resource_type": "locale_field"
            }
        ],
        "slugs": [
            {
                "locale": "en-us",
                "translation": "1-getting-started",
                "resource_type": "slug"
            }
        ],
        "descriptions": [
            {
                "id": 1,
                "resource_type": "locale_field"
            }
        ],
        "brand": {
            "id": 1,
            "name": "Kayako",
            "resource_type": "brand",
            "resource_url": "https://brewfictus.kayako.com/api/v1/brands/1"
        },
        "display_order": 1,
        "created_at": "2016-04-13T07:32:51+00:00",
        "updated_at": "2016-04-13T07:32:51+00:00",
        "resource_type": "category",
        "resource_url": "https://brewfictus.kayako.com/api/v1/categories/1"
    },
    "resource": "category"
}
```

## Update categories

PUT**/api/v1/categories.json**

### Information

Allowed for Agents, Admins & Owners

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| brand_id | integer |  |  |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```

## Reorder categories

PUT**/api/v1/categories/reorder.json**

### Information

Allowed for Agents, Admins & Owners

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| category_ids | sections |  | Pass the category ids in order you want to set |
| brand_id | integer |  | If not specified then the default brand will be applicable |

### Response

```
{
    "status": 200
}
```

## Delete a category

DELETE**/api/v1/categories/:id.json**

### Information

Allowed for Agents, Admins & Owners

_Note:_ All sections and articles in the category will also be deleted.

### Response

```
{
    "status": 200
}
```

## Delete categories

DELETE**/api/v1/categories.json**

### Information

Allowed for Agents, Admins & Owners

_Note:_ All sections and articles in the category will also be deleted.

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```




### Comments

Title: Comments - Help Center | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/help_center/comments/

Markdown Content:
# Comments - Help Center | Kayako Developers

[![Image 1](https://developer.kayako.com/img/kayako-logo.png)](https://developer.kayako.com/)

*     
*   [Docs](https://developer.kayako.com/docs/single_sign_on/introduction/)
*   [API](https://developer.kayako.com/api/v1/reference/introduction/)
*   [SDK](https://developer.kayako.com/sdk/java/integration_guide/)
*   [Messenger![Image 2: beta](https://developer.kayako.com/img/new.png)](https://developer.kayako.com/messenger/home/)

*     
*   [Docs](https://developer.kayako.com/docs/single_sign_on/introduction/)
*   [API](https://developer.kayako.com/api/v1/reference/introduction/)
*   [SDK](https://developer.kayako.com/sdk/java/integration_guide/)
*   [Messenger![Image 3: beta](https://developer.kayako.com/img/new.png)](https://developer.kayako.com/messenger/home/)

Help Center

*   [Reference](https://developer.kayako.com/api/v1/reference/introduction/)
Core*   [Users](https://developer.kayako.com/api/v1/users/activities/)
*   [Cases](https://developer.kayako.com/api/v1/cases/activities/)
*   [Insights](https://developer.kayako.com/api/v1/insights/cases/)
*   [Search](https://developer.kayako.com/api/v1/search/search/)
*   [Automation](https://developer.kayako.com/api/v1/automation/endpoints/)
Channels*   [Twitter](https://developer.kayako.com/api/v1/twitter/accounts/)
*   [Facebook](https://developer.kayako.com/api/v1/facebook/accounts/)
*   [Mail](https://developer.kayako.com/api/v1/mail/mailboxes/)
*   [Event](https://developer.kayako.com/api/v1/event/events/)
*   [Help Center](https://developer.kayako.com/api/v1/help_center/articles/)
Others*   [General](https://developer.kayako.com/api/v1/general/autocomplete/)

*   [Articles](https://developer.kayako.com/api/v1/help_center/articles/)
*   [Categories](https://developer.kayako.com/api/v1/help_center/categories/)
*   [Comments](https://developer.kayako.com/api/v1/help_center/comments/)
    *   [Resource fields](https://developer.kayako.com/api/v1/help_center/comments/#resource-fields)
    *   [Retrieve all comments](https://developer.kayako.com/api/v1/help_center/comments/#Retrieve-all-comments)
    *   [Retrieve a comment](https://developer.kayako.com/api/v1/help_center/comments/#Retrieve-a-comment)
    *   [Add a comment](https://developer.kayako.com/api/v1/help_center/comments/#Add-a-comment)
    *   [Update a comment](https://developer.kayako.com/api/v1/help_center/comments/#Update-a-comment)
    *   [Mark comment as published](https://developer.kayako.com/api/v1/help_center/comments/#Mark-comment-as-published)
    *   [Mark comment as spam](https://developer.kayako.com/api/v1/help_center/comments/#Mark-comment-as-spam)
    *   [Delete a comment](https://developer.kayako.com/api/v1/help_center/comments/#Delete-a-comment)
    *   [Likes](https://developer.kayako.com/api/v1/help_center/comments/#Likes)
        *   [Retrieve all likes](https://developer.kayako.com/api/v1/help_center/comments/#Likes__Retrieve-all-likes)
        *   [Like a comment](https://developer.kayako.com/api/v1/help_center/comments/#Likes__Like-a-comment)
        *   [Unlike a comment](https://developer.kayako.com/api/v1/help_center/comments/#Likes__Unlike-a-comment)

*   [Conversations](https://developer.kayako.com/api/v1/help_center/conversations/)
*   [Favicon](https://developer.kayako.com/api/v1/help_center/favicon/)
*   [Help Centers](https://developer.kayako.com/api/v1/help_center/help_centers/)
*   [Logo](https://developer.kayako.com/api/v1/help_center/logo/)
*   [Messenger](https://developer.kayako.com/api/v1/help_center/messenger/)
*   [Search](https://developer.kayako.com/api/v1/help_center/search/)
*   [Sections](https://developer.kayako.com/api/v1/help_center/sections/)
*   [Templates](https://developer.kayako.com/api/v1/help_center/templates/)
*   [Users](https://developer.kayako.com/api/v1/help_center/users/)

1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   CHANNELS
4.   HELP CENTER

# Comments

## Resource Fields

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| contents | string |  |  |
| is_html | boolean |  |  |
| status | string |  | `PUBLISHED`, `SPAM` |
| user | [User](https://developer.kayako.com/api/v1/users/users/) |  |  |
| replies | [Comments](https://developer.kayako.com/api/v1/help_center/comments/) |  |  |
| is_liked | boolean |  |  |
| like_count | integer |  |  |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Metadata

Version 1.0
Last Updated July 04, 2016

## Actions

## Retrieve all comments

GET**/api/v1/articles/:id/comments.json**

### Information

Allowed for Public
Ordered by created_at (descending)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| filter | string |  | `PUBLISHED`, `SPAM` |

### Response

```text
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "contents": "Really nice article <V60 pour over brewing>! keep posting!",
            "is_html": false,
            "status": "PUBLISHED",
            "user": {
                "id": 1,
                "resource_type": "user_minimal"
            },
            "replies": [],
            "is_liked": false,
            "like_count": 0,
            "created_at": "2016-06-30T11:08:06+00:00",
            "updated_at": "2016-06-30T11:08:06+00:00",
            "resource_type": "comment",
            "resource_url": "https://brewfictus.kayako.com/api/v1/articles/1/comments/1"
        }
    ],
    "resource": "comment",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Retrieve a comment

GET**/api/v1/articles/:id/comments/:id.json**

### Information

Allowed for Public

### Response

```text
{
    "status": 200,
    "data": {
        "id": 1,
        "contents": "Really nice article <V60 pour over brewing>! keep posting!",
        "is_html": false,
        "status": "PUBLISHED",
        "user": {
            "id": 1,
            "resource_type": "user_minimal"
        },
        "replies": [],
        "is_liked": false,
        "like_count": 0,
        "created_at": "2016-06-30T11:08:06+00:00",
        "updated_at": "2016-06-30T11:08:06+00:00",
        "resource_type": "comment",
        "resource_url": "https://brewfictus.kayako.com/api/v1/articles/1/comments/1"
    },
    "resource": "comment"
}
```

## Add a comment

POST**/api/v1/articles/:id/comments.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

_Note:_ User is allowed to update their comments within duration of 10 minutes

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| contents | string |  |  |
| is_html | boolean |  | **Default:**`false` |

### Response

```text
{
    "status": 201,
    "data": {
        "id": 1,
        "contents": "Really nice article <V60 pour over brewing>! keep posting!",
        "is_html": false,
        "status": "PUBLISHED",
        "user": {
            "id": 1,
            "resource_type": "user_minimal"
        },
        "replies": [],
        "is_liked": false,
        "like_count": 0,
        "created_at": "2016-06-30T11:08:06+00:00",
        "updated_at": "2016-06-30T11:08:06+00:00",
        "resource_type": "comment",
        "resource_url": "https://brewfictus.kayako.com/api/v1/articles/1/comments/1"
    },
    "resource": "comment"
}
```

## Update a comment

PUT**/api/v1/articles/:id/comments/:id.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

_Note:_ User is allowed to update their comments within duration of 10 minutes

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| contents | string |  |  |

### Response

```text
{
    "status": 200,
    "data": {
        "id": 1,
        "contents": "Really nice article <V60 pour over brewing>! keep posting!",
        "is_html": false,
        "status": "PUBLISHED",
        "user": {
            "id": 1,
            "resource_type": "user_minimal"
        },
        "replies": [],
        "is_liked": false,
        "like_count": 0,
        "created_at": "2016-06-30T11:08:06+00:00",
        "updated_at": "2016-06-30T11:08:06+00:00",
        "resource_type": "comment",
        "resource_url": "https://brewfictus.kayako.com/api/v1/articles/1/comments/1"
    },
    "resource": "comment"
}
```

## Mark comment as published

PUT**/api/v1/articles/:id/comments/:id/publish**

### Information

Allowed for Collaborators, Agents, Admins & Owners

### Response

```text
{
    "status": 200
}
```

## Mark comment as spam

PUT**/api/v1/articles/:id/comments/:id/spam**

### Information

Allowed for Collaborators, Agents, Admins & Owners

### Response

```text
{
    "status": 200
}
```

## Delete a comment

DELETE**/api/v1/articles/:id/comments/:id.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

_Note:_ User is allowed to delete their comments within duration of 10 minutes

### Response

```text
{
    "status": 200
}
```

## Likes

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| user | [User](https://developer.kayako.com/api/v1/users/users/) |  |  |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve all likes

GET**/api/v1/articles/:id/comments/:id/likes.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

### Response

```text
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "user": {
                "id": 1,
                "resource_type": "user"
            },
            "created_at": "2015-07-21T16:58:13+05:00",
            "resource_type": "like"
        }
    ],
    "resource": "like",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Like a comment

POST**/api/v1/articles/:id/comments/:id/likes.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

### Response

```text
{
    "status": 201
}
```

## Unlike a comment

DELETE**/api/v1/articles/:id/comments/:id/likes.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

### Response

```text
{
    "status": 200
}
```

 Copyright © 2018 [Kayako](http://www.kayako.com/). All rights reserved • [Privacy Policy](http://www.kayako.com/about/privacy)

[](https://www.facebook.com/kayako/)[](https://twitter.com/kayako)




### Conversations

Title: Conversations - Help Center | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/help_center/conversations/

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   CHANNELS
4.   HELP CENTER

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| uuid | string |  |  |
| legacy_id | string |  |  |
| subject | string |  |  |
| channel | string |  |  |
| requester | [User](https://developer.kayako.com/api/v1/users/users/) |  | The requester of the conversation, represented as a user resource |
| creator | [User](https://developer.kayako.com/api/v1/users/users/) |  | The creator of the conversation, represented as a user resource |
| last_replier | [User](https://developer.kayako.com/api/v1/users/users/) |  | The user (agent/customer) who responded last |
| last_agent_replier | [User](https://developer.kayako.com/api/v1/users/users/) |  | The agent who responded last. |
| assigned_team | [Team](https://developer.kayako.com/api/v1/users/teams/) |  | The team that this conversation is currently assigned to |
| assigned_agent | [User](https://developer.kayako.com/api/v1/users/users/) |  | The agent that this conversation is currently assigned to |
| status | [Status](https://developer.kayako.com/api/v1/cases/statuses/) |  | The status of this conversation. Returns `null` if the field is not visible to customers |
| is_closed | boolean |  | Whether the conversation is closed or not. Closed conversations cannnot be replied to. |
| priority | [Priority](https://developer.kayako.com/api/v1/cases/priorities/) |  | Priority, defines the urgency with which the conversation should be addressed. Returns `null` if the field is not visible to customers |
| type | [Type](https://developer.kayako.com/api/v1/cases/types/) |  | The Type of this conversation. Returns `null` if the field is not visible to customers |
| read_marker | [Read marker](https://developer.kayako.com/api/v1/help_center/conversations/#read-marker) |  | [Read marker](https://developer.kayako.com/api/v1/help_center/conversations/#read-marker) for the currently logged in user |
| custom_fields | [Custom Fields](https://developer.kayako.com/api/v1/help_center/conversations/#Custom-fields) |  | List of all custom fields that are visible to customers. |
| realtime_channel | string |  | Subscribe to this channel for realtime updates |
| last_message_status | string |  | `SENT`, `DELIVERED`, `REJECTED`, `SEEN` |
| last_message_preview | string |  | Preview text of the last message on this conversation |
| last_replied_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Read marker

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| id | integer |  |  |
| last_read_post_id | integer |  |  |
| last_read_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| unread_count | integer |  |  |

## Retrieve all conversations

GET**/api/v1/conversations.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners
Ordered by created_at (descending)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| status | string |  | `NEW`, `OPEN`, `PENDING`, `COMPLETED`, `CLOSED`, `CUSTOM` |
| priority | integer |  | Include all conversation having priority level less than or equal to provided level |
| filters | string |  | `MY_ORGANIZATION` |

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "uuid": "3502b1bf-8a7f-5ac7-967e-e2f02d0fb056",
            "legacy_id": null,
            "subject": "Atmosphere Coffee, Inc annual maintenance",
            "channel": "MAIL",
            "requester": {
                "id": 2,
                "resource_type": "user_minimal"
            },
            "creator": {
                "id": 1,
                "resource_type": "user_minimal"
            },
            "last_replier": {
                "id": 1,
                "resource_type": "user_minimal"
            },
            "last_agent_replier": {
                "id": 1,
                "resource_type": "user_minimal"
            },
            "assigned_team": {
                "id": 1,
                "legacy_id": null,
                "resource_type": "team"
            },
            "assigned_agent": {
                "id": 1,
                "resource_type": "user_minimal"
            },
            "status": {
                "id": 1,
                "resource_type": "case_status"
            },
            "is_closed": false,
            "priority": {
                "id": 3,
                "resource_type": "case_priority"
            },
            "type": {
                "id": 1,
                "resource_type": "case_type"
            },
            "read_marker": {
                "id": 1,
                "resource_type": "read_marker"
            },
            "custom_fields": [
                {
                    "field": {
                        "id": 10,
                        "resource_type": "conversation_field"
                    },
                    "value": "12",
                    "resource_type": "conversation_field_value"
                }
            ],
            "last_message_status": "SEEN",
            "last_message_preview": "Coffee machine annual maintenance",
            "realtime_channel": "presence-d6c6a8b31be92885222ee53dde6c99c745c5f4cf77f1bd9dd3519d07fa730c71@v1_cases_1",
            "last_replied_at": "2015-07-27T11:35:09+05:00",
            "created_at": "2015-12-28T08:52:45+05:00",
            "updated_at": "2015-12-28T08:52:45+05:00",
            "resource_type": "conversation",
            "resource_url": "https://brewfictus.kayako.com/api/v1/conversations/1"
        }
    ],
    "resource": "conversation",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Retrieve a conversation

GET**/api/v1/conversations/:id.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "uuid": "3502b1bf-8a7f-5ac7-967e-e2f02d0fb056",
        "legacy_id": null,
        "subject": "Atmosphere Coffee, Inc annual maintenance",
        "channel": "MAIL",
        "requester": {
            "id": 2,
            "resource_type": "user_minimal"
        },
        "creator": {
            "id": 1,
            "resource_type": "user_minimal"
        },
        "last_replier": {
            "id": 1,
            "resource_type": "user_minimal"
        },
        "last_agent_replier": {
            "id": 1,
            "resource_type": "user_minimal"
        },
        "assigned_team": {
            "id": 1,
            "legacy_id": null,
            "resource_type": "team"
        },
        "assigned_agent": {
            "id": 1,
            "resource_type": "user_minimal"
        },
        "status": {
            "id": 1,
            "resource_type": "case_status"
        },
        "is_closed": false,
        "priority": {
            "id": 3,
            "resource_type": "case_priority"
        },
        "type": {
            "id": 1,
            "resource_type": "case_type"
        },
        "read_marker": {
            "id": 1,
            "resource_type": "read_marker"
        },
        "custom_fields": [
            {
                "field": {
                    "id": 10,
                    "resource_type": "conversation_field"
                },
                "value": "12",
                "resource_type": "conversation_field_value"
            }
        ],
        "last_message_status": "SEEN",
        "last_message_preview": "Coffee machine annual maintenance",
        "realtime_channel": "presence-d6c6a8b31be92885222ee53dde6c99c745c5f4cf77f1bd9dd3519d07fa730c71@v1_cases_1",
        "last_replied_at": "2015-07-27T11:35:09+05:00",
        "created_at": "2015-12-28T08:52:45+05:00",
        "updated_at": "2015-12-28T08:52:45+05:00",
        "resource_type": "conversation",
        "resource_url": "https://brewfictus.kayako.com/api/v1/conversations/1"
    },
    "resource": "conversation"
}
```

## Retrieve a conversation on token

GET**/api/v1/conversations/:id.json**

### Information

Allowed for Public

_Note:_ Token is returned in response header in `X-Request-Token` parameter. Token is valid for next 120 seconds post creation.

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| token | string |  |  |

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "uuid": "3502b1bf-8a7f-5ac7-967e-e2f02d0fb056",
        "legacy_id": null,
        "subject": "Atmosphere Coffee, Inc annual maintenance",
        "channel": "MAIL",
        "requester": {
            "id": 2,
            "resource_type": "user_minimal"
        },
        "creator": {
            "id": 1,
            "resource_type": "user_minimal"
        },
        "last_replier": {
            "id": 1,
            "resource_type": "user_minimal"
        },
        "last_agent_replier": {
            "id": 1,
            "resource_type": "user_minimal"
        },
        "assigned_team": {
            "id": 1,
            "legacy_id": null,
            "resource_type": "team"
        },
        "assigned_agent": {
            "id": 1,
            "resource_type": "user_minimal"
        },
        "status": {
            "id": 1,
            "resource_type": "case_status"
        },
        "is_closed": false,
        "priority": {
            "id": 3,
            "resource_type": "case_priority"
        },
        "type": {
            "id": 1,
            "resource_type": "case_type"
        },
        "read_marker": {
            "id": 1,
            "resource_type": "read_marker"
        },
        "custom_fields": [
            {
                "field": {
                    "id": 10,
                    "resource_type": "conversation_field"
                },
                "value": "12",
                "resource_type": "conversation_field_value"
            }
        ],
        "last_message_status": "SEEN",
        "last_message_preview": "Coffee machine annual maintenance",
        "realtime_channel": "presence-d6c6a8b31be92885222ee53dde6c99c745c5f4cf77f1bd9dd3519d07fa730c71@v1_cases_1",
        "last_replied_at": "2015-07-27T11:35:09+05:00",
        "created_at": "2015-12-28T08:52:45+05:00",
        "updated_at": "2015-12-28T08:52:45+05:00",
        "resource_type": "conversation",
        "resource_url": "https://brewfictus.kayako.com/api/v1/conversations/1"
    },
    "resource": "conversation"
}
```

## Retrieve participants

GET**/api/v1/conversations/:id/participants.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "uuid": "11b60c25-c44c-47b8-9f48-56631cd7fa01",
            "full_name": "Simon Blackhouse",
            "role": {
                "id": 2,
                "resource_type": "role"
            },
            "teams": [
                {
                    "id": 6,
                    "resource_type": "team_minimal"
                }
            ],
            "avatar": "https://brewfictus.kayako.com/avatar/get/a6d2cc92-85e7-5005-b962-955efa915d26",
            "last_activity_at": "2015-12-13T06:39:09+05:00",
            "last_active_at": "2015-12-13T06:39:09+05:00",
            "last_seen_at": "2015-12-13T06:39:09+05:00",
            "presence_channel": "user_presence-281f395f6f51d031a6d3db3489906c98285191ebac41bb744f9323f61af63433@5c98cdaa58dd91ff1119a476e8b3e305d2906d3b",
            "resource_type": "user_minimal",
            "resource_url": "https://brewfictus.kayako.com/api/v1/users/2"
        }
    ],
    "resource": "user_minimal",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Add a conversation

POST**/api/v1/conversations.json**

### Information

Allowed for Public

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| name | string |  | Name of the user creating this conversation. Only required if not logged in. |
| email | string |  | Email of the user creating this conversation. Only required if not logged in. If a [User](https://developer.kayako.com/api/v1/users/users/) by this email does not exist, a new one is created |
| subject | string |  |  |
| contents | string |  | The contents of the first message on this conversation |
| source | string |  | `HELPCENTER`, `MESSENGER`, `API` |
| metadata | array |  | We accept metadata in key - value pairs **Example:** {"user_agent":"Chrome", "page_url":"[https://brewfictus.kayako.com/pricing"](https://brewfictus.kayako.com/pricing%22)} **_Note_:** Currently only `user_agent`&`page_url` are supported, user_agent can be used to set user-friendly names like Chrome, Firefox etc |
| priority_id | integer |  | ID of the [Priority](https://developer.kayako.com/api/v1/cases/priorities/#resource-fields) to assign to this case. Only accepted if customers are allowed to edit priorities |
| form_id | integer |  |  |
| field_values | array |  | Format: `{"field_key" => "value"}` |
| files | array |  | File Upload multipart/form-data |
| client_id | string |  | If provided, this value will be returned in the [Messages](https://developer.kayako.com/api/v1/help_center/conversations/#Messages) resource. Used to identify messages reflected back from the server. |

### Response

```
{
    "status": 201,
    "data": {
        "id": 1,
        "uuid": "3502b1bf-8a7f-5ac7-967e-e2f02d0fb056",
        "legacy_id": null,
        "subject": "Atmosphere Coffee, Inc annual maintenance",
        "channel": "MAIL",
        "requester": {
            "id": 2,
            "resource_type": "user_minimal"
        },
        "creator": {
            "id": 1,
            "resource_type": "user_minimal"
        },
        "last_replier": {
            "id": 1,
            "resource_type": "user_minimal"
        },
        "last_agent_replier": {
            "id": 1,
            "resource_type": "user_minimal"
        },
        "assigned_team": {
            "id": 1,
            "legacy_id": null,
            "resource_type": "team"
        },
        "assigned_agent": {
            "id": 1,
            "resource_type": "user_minimal"
        },
        "status": {
            "id": 1,
            "resource_type": "case_status"
        },
        "is_closed": false,
        "priority": {
            "id": 3,
            "resource_type": "case_priority"
        },
        "type": {
            "id": 1,
            "resource_type": "case_type"
        },
        "read_marker": {
            "id": 1,
            "resource_type": "read_marker"
        },
        "custom_fields": [
            {
                "field": {
                    "id": 10,
                    "resource_type": "conversation_field"
                },
                "value": "12",
                "resource_type": "conversation_field_value"
            }
        ],
        "last_message_status": "SEEN",
        "last_message_preview": "Coffee machine annual maintenance",
        "realtime_channel": "presence-d6c6a8b31be92885222ee53dde6c99c745c5f4cf77f1bd9dd3519d07fa730c71@v1_cases_1",
        "last_replied_at": "2015-07-27T11:35:09+05:00",
        "created_at": "2015-12-28T08:52:45+05:00",
        "updated_at": "2015-12-28T08:52:45+05:00",
        "resource_type": "conversation",
        "resource_url": "https://brewfictus.kayako.com/api/v1/conversations/1"
    },
    "resource": "conversation"
}
```

## Update a conversation

PUT**/api/v1/conversations/:id.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| source | string |  | Allowed values: `HELPCENTER`, `MESSENGER`, `API`. This parameter can be used to execute different [Triggers](https://developer.kayako.com/api/v1/automation/triggers/) depending on the source of the update. |
| field_values | array |  | Format: `['field_key' => value]` |
| subject | string |  |  |
| priority_id | integer |  |  |
| status_id | integer |  |  |
| type_id | integer |  |  |

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "uuid": "3502b1bf-8a7f-5ac7-967e-e2f02d0fb056",
        "legacy_id": null,
        "subject": "Atmosphere Coffee, Inc annual maintenance",
        "channel": "MAIL",
        "requester": {
            "id": 2,
            "resource_type": "user_minimal"
        },
        "creator": {
            "id": 1,
            "resource_type": "user_minimal"
        },
        "last_replier": {
            "id": 1,
            "resource_type": "user_minimal"
        },
        "last_agent_replier": {
            "id": 1,
            "resource_type": "user_minimal"
        },
        "assigned_team": {
            "id": 1,
            "legacy_id": null,
            "resource_type": "team"
        },
        "assigned_agent": {
            "id": 1,
            "resource_type": "user_minimal"
        },
        "status": {
            "id": 1,
            "resource_type": "case_status"
        },
        "is_closed": false,
        "priority": {
            "id": 3,
            "resource_type": "case_priority"
        },
        "type": {
            "id": 1,
            "resource_type": "case_type"
        },
        "read_marker": {
            "id": 1,
            "resource_type": "read_marker"
        },
        "custom_fields": [
            {
                "field": {
                    "id": 10,
                    "resource_type": "conversation_field"
                },
                "value": "12",
                "resource_type": "conversation_field_value"
            }
        ],
        "last_message_status": "SEEN",
        "last_message_preview": "Coffee machine annual maintenance",
        "realtime_channel": "presence-d6c6a8b31be92885222ee53dde6c99c745c5f4cf77f1bd9dd3519d07fa730c71@v1_cases_1",
        "last_replied_at": "2015-07-27T11:35:09+05:00",
        "created_at": "2015-12-28T08:52:45+05:00",
        "updated_at": "2015-12-28T08:52:45+05:00",
        "resource_type": "conversation",
        "resource_url": "https://brewfictus.kayako.com/api/v1/conversations/1"
    },
    "resource": "conversation"
}
```

## Messages

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| uuid | string |  |  |
| client_id | string |  | `client_id` is provided by the client when creating a message. Can be used to identify messages reflected from the server back to the originating entity. This value may be `null` if not supplied by the client. Since this is only useful for realtime communication, older values might be erased periodically. |
| subject | string |  |  |
| channel | string |  | Channel represents the source from which message was originally created. `MAIL`, `HELPCENTER`, `TWITTER`, `MESSENGER`, `FACEBOOK` |
| content_text | string |  |  |
| content_html | string |  |  |
| creator | [User](https://developer.kayako.com/api/v1/users/users/) |  | The creator of the post, represented as a user resource |
| attachments | [Attachments](https://developer.kayako.com/api/v1/help_center/conversations/#attachments) |  |  |
| download_all | string |  |  |
| source | string |  | `API`, `AGENT`, `MAIL`, `MESSENGER`, `MOBILE`, `HELPCENTER` |
| metadata | array |  | Metadata will be in key - value pair |
| message_status | string |  | `SENT`, `DELIVERED`, `REJECTED`, `SEEN` **Default:**`SENT` |
| message_status_reject_type | string |  | `BOUNCE`, `BLOCKED`, `DROPPED`, `DEFERRED`, `EXPIRED`, `ERROR` **Note:** This field applicable for `REJECTED` message_status |
| message_status_reject_reason | string |  | Reject reason from MTA **Note:** This field applicable for `REJECTED` message_status |
| message_status_updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| resource_type | string |  | Categorized the posts (`Facebook`, `Twitter`, `Email` etc.) |

## Attachments

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| size | integer |  |  |
| width | integer |  | Only if the attachment is image |
| height | integer |  | Only if the attachment is image |
| type | string |  | Mime-type of the file |
| content_id | string |  | Content ID used for inline attachment |
| alt | string |  |  |
| url | string |  | The URL to view the attachment |
| url_download | string |  | The URL to download the attachment |
| thumbnails | [Thumbnails](https://developer.kayako.com/api/v1/help_center/conversations/#thumbnails) |  |  |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Thumbnails

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| size | integer |  |  |
| width | integer |  |  |
| height | integer |  |  |
| type | string |  | Mime-type of the file |
| url | string |  | The URL to view the thumbnail |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve all messages

GET**/api/v1/conversations/:id/messages.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners
Ordered by created_at (descending)

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "uuid": "c96c7abe-2d75-4ab9-ad85-87cf1b609e93",
            "client_id": "93a236f0-edac-4b5a-8747-14140da7d4dc",
            "subject": "Atmosphere Coffee, Inc annual maintenance",
            "channel": "MAIL",
            "content_text": "Dear Caryn,\n\n\t\t\t\tIt is that fun time of the year again - annual maintenance time! Further to our phone conversation, .....",
            "content_html": "Dear Caryn,<br />\n<br />\n\t\t\t\tIt is that fun time of the year again - annual maintenance time! Further to our phone conversation, .....",
            "creator": {
                "id": 1,
                "resource_type": "user_minimal"
            },
            "attachments": [],
            "download_all": null,
            "source": "MESSENGER",
            "metadata": {
                "user_agent": "Chrome",
                "page_url": "https://brewfictus.kayako.com/pricing"
            },
            "message_status": "SENT",
            "message_status_reject_type": null,
            "message_status_reject_reason": null,
            "message_status_updated_at": "2016-11-08T18:44:27+00:00",
            "created_at": "2015-12-28T08:52:45+05:00",
            "updated_at": "2015-12-28T08:52:45+05:00",
            "resource_type": "case_message",
            "resource_url": "https://brewfictus.kayako.com/api/v1/conversations/1/messages/1"
        }
    ],
    "resource": "conversation_message",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Retrieve a message

GET**/api/v1/conversations/:id/messages/:id.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "uuid": "c96c7abe-2d75-4ab9-ad85-87cf1b609e93",
        "client_id": "93a236f0-edac-4b5a-8747-14140da7d4dc",
        "subject": "Atmosphere Coffee, Inc annual maintenance",
        "channel": "MAIL",
        "content_text": "Dear Caryn,\n\n\t\t\t\tIt is that fun time of the year again - annual maintenance time! Further to our phone conversation, .....",
        "content_html": "Dear Caryn,<br />\n<br />\n\t\t\t\tIt is that fun time of the year again - annual maintenance time! Further to our phone conversation, .....",
        "creator": {
            "id": 1,
            "resource_type": "user_minimal"
        },
        "attachments": [],
        "download_all": null,
        "source": "MESSENGER",
        "metadata": {
            "user_agent": "Chrome",
            "page_url": "https://brewfictus.kayako.com/pricing"
        },
        "message_status": "SENT",
        "message_status_reject_type": null,
        "message_status_reject_reason": null,
        "message_status_updated_at": "2016-11-08T18:44:27+00:00",
        "created_at": "2015-12-28T08:52:45+05:00",
        "updated_at": "2015-12-28T08:52:45+05:00",
        "resource_type": "case_message",
        "resource_url": "https://brewfictus.kayako.com/api/v1/conversations/1/messages/1"
    },
    "resource": "conversation_message"
}
```

## Add a message

POST**/api/v1/conversations/:id/messages.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| contents | string |  |  |
| source | string |  | `HELPCENTER`, `MESSENGER`, `API` |
| metadata | array |  | We accept the metadata in key - value pair **Example:** {"user_agent":"Chrome", "page_url":"[https://brewfictus.kayako.com/pricing"](https://brewfictus.kayako.com/pricing%22)} Currently we support `user_agent`&`page_url`, `user_agent` can be used to set user-friendly names like Chrome, Firefox etc. A raw user agent string (like `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/55.0.2883.87 Chrome/55.0.2883.87 Safari/537.36`) can also be passed in using the key `user_agent_raw`. This will be parsed and set in the `user_agent` node. |
| client_id | string |  | If provided, this value will be returned in the [Messages](https://developer.kayako.com/api/v1/help_center/conversations/#Messages) resource. Used to identify messages reflected back from the server. |
| files | array |  | File Upload multipart/form-data |
| file_ids | string |  | Comma-separated list of file IDs. Files can be uploaded via the [Add a file endpoint](https://developer.kayako.com/api/v1/general/files/#Add-a-file) |

### Response

```
{
    "status": 201,
    "data": {
        "id": 1,
        "uuid": "c96c7abe-2d75-4ab9-ad85-87cf1b609e93",
        "client_id": "93a236f0-edac-4b5a-8747-14140da7d4dc",
        "subject": "Atmosphere Coffee, Inc annual maintenance",
        "channel": "MAIL",
        "content_text": "Dear Caryn,\n\n\t\t\t\tIt is that fun time of the year again - annual maintenance time! Further to our phone conversation, .....",
        "content_html": "Dear Caryn,<br />\n<br />\n\t\t\t\tIt is that fun time of the year again - annual maintenance time! Further to our phone conversation, .....",
        "creator": {
            "id": 1,
            "resource_type": "user_minimal"
        },
        "attachments": [],
        "download_all": null,
        "source": "MESSENGER",
        "metadata": {
            "user_agent": "Chrome",
            "page_url": "https://brewfictus.kayako.com/pricing"
        },
        "message_status": "SENT",
        "message_status_reject_type": null,
        "message_status_reject_reason": null,
        "message_status_updated_at": "2016-11-08T18:44:27+00:00",
        "created_at": "2015-12-28T08:52:45+05:00",
        "updated_at": "2015-12-28T08:52:45+05:00",
        "resource_type": "case_message",
        "resource_url": "https://brewfictus.kayako.com/api/v1/conversations/1/messages/1"
    },
    "resource": "conversation_message"
}
```

## Update a Message

PUT**/api/v1/conversations/:id/messages/:id.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| message_status | string |  | Allowed values are `DELIVERED`, `SEEN` |

### Response

```
{
    "status": 200
}
```

## Conversation forms

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| title | string |  | **Deprecated: This field will be removed soon** |
| titles | [Field Locales](https://developer.kayako.com/api/v1/general/field_locales/) |  |  |
| description | string |  | **Deprecated: This field will be removed soon** |
| descriptions | [Field Locales](https://developer.kayako.com/api/v1/general/field_locales/) |  |  |
| fields | [Fields](https://developer.kayako.com/api/v1/help_center/conversations/#custom-fields) |  |  |
| brand | [Brand](https://developer.kayako.com/api/v1/general/brands/) |  |  |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve all forms

GET**/api/v1/conversations/forms.json**

### Information

Allowed for Public
Ordered by sort_order (ascending)

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "title": "Maintenance job form",
            "description": null,
            "fields": [
                {
                    "id": 10,
                    "resource_type": "conversation_field"
                }
            ],
            "brand": null,
            "created_at": "2015-12-28T08:52:45+05:00",
            "updated_at": "2015-12-28T08:52:45+05:00",
            "resource_type": "conversation_form",
            "resource_url": "https://brewfictus.kayako.com/api/v1/conversations/forms/1"
        }
    ],
    "resource": "conversation_form",
    "total_count": 1
}
```

## Retrieve a from

GET**/api/v1/conversations/forms/:id.json**

### Information

Allowed for Public

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "title": "Maintenance job form",
        "description": null,
        "fields": [
            {
                "id": 10,
                "resource_type": "conversation_field"
            }
        ],
        "brand": null,
        "created_at": "2015-12-28T08:52:45+05:00",
        "updated_at": "2015-12-28T08:52:45+05:00",
        "resource_type": "conversation_form",
        "resource_url": "https://brewfictus.kayako.com/api/v1/conversations/forms/1"
    },
    "resource": "conversation_form"
}
```

## Custom fields

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| fielduuid | string |  |  |
| titles | [Field Locales](https://developer.kayako.com/api/v1/general/field_locales/) |  |  |
| type | string |  | Supported Types: `TEXT`, `TEXTAREA`, `CHECKBOX`, `RADIO`, `SELECT`, `DATE`, `FILE`, `NUMERIC`, `DECIMAL`, `YESNO`, `REGEX`, `CASCADINGSELECT` |
| key | string |  |  |
| descriptions | [Field Locales](https://developer.kayako.com/api/v1/general/field_locales/) |  |  |
| is_required | boolean |  |  |
| is_editable | boolean |  |  |
| is_system | boolean |  |  |
| regular_expression | string |  |  |
| options | [Options](https://developer.kayako.com/api/v1/cases/fields/#Options) |  | Presented for a field of type `CHECKBOX`, `RADIO`, `SELECT`, `CASCADINGSELECT` |
| created_at | string |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | string |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve fields

GET**/api/v1/conversations/fields.json**

### Information

Allowed for Public

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 10,
            "fielduuid": "7a9b2b25-b164-48a5-99c4-59eee826e285",
            "titles": [
                {
                    "id": 1,
                    "resource_type": "locale_field"
                },
                {
                    "id": 2,
                    "resource_type": "locale_field"
                }
            ],
            "type": "NUMERIC",
            "key": "reported_issues",
            "descriptions": [],
            "is_required": true,
            "is_editable": true,
            "is_system": false,
            "regular_expression": null,
            "options": [],
            "created_at": "2015-12-28T08:52:45+05:00",
            "updated_at": "2015-12-28T08:52:45+05:00",
            "resource_type": "conversation_field",
            "resource_url": "https://brewfictus.kayako.com/api/v1/conversations/fields/10"
        }
    ],
    "resource": "conversation_field",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Retrieve a field

GET**/api/v1/conversations/fields/:id.json**

### Information

Allowed for Public

### Response

```
{
    "status": 200,
    "data": {
        "id": 10,
        "fielduuid": "7a9b2b25-b164-48a5-99c4-59eee826e285",
        "titles": [
            {
                "id": 1,
                "resource_type": "locale_field"
            },
            {
                "id": 2,
                "resource_type": "locale_field"
            }
        ],
        "type": "NUMERIC",
        "key": "reported_issues",
        "descriptions": [],
        "is_required": true,
        "is_editable": true,
        "is_system": false,
        "regular_expression": null,
        "options": [],
        "created_at": "2015-12-28T08:52:45+05:00",
        "updated_at": "2015-12-28T08:52:45+05:00",
        "resource_type": "conversation_field",
        "resource_url": "https://brewfictus.kayako.com/api/v1/conversations/fields/10"
    },
    "resource": "conversation_field"
}
```

## Satisfaction Ratings

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| score | string |  | `GOOD`, `BAD` |
| comment | string |  | The comment provided when creating this rating. Can be empty if no comment was provided. |
| conversation | [Conversation](https://developer.kayako.com/api/v1/help_center/conversations/) |  | The [Conversation](https://developer.kayako.com/api/v1/help_center/conversations/) that this rating belongs to |
| creator | [User](https://developer.kayako.com/api/v1/users/users/) |  | The [User](https://developer.kayako.com/api/v1/users/users/) that created this rating |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve all ratings

GET**/api/v1/conversations/:id/ratings.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners
Ordered by created_at (descending)

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "score": "GOOD",
            "comment": "Excellent service!",
            "conversation": {
                "id": 1,
                "resource_type": "conversation"
            },
            "creator": {
                "id": 2,
                "resource_type": "user_minimal"
            },
            "created_at": "2015-07-28T06:15:24+05:00",
            "updated_at": "2015-07-28T06:15:24+05:00",
            "resource_type": "conversation_rating",
            "resource_url": "https://brewfictus.kayako.com/api/v1/cases/ratings/1"
        }
    ],
    "resource": "conversation_rating",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Add a rating

POST**/api/v1/conversations/:id/ratings.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

Only creator of the conversation is allowed to rate their conversation.

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| score | string |  | `GOOD`/`BAD` |
| comment | string |  | A comment to be added to this rating. Can be updated later if required. |

### Response

```
{
    "status": 201,
    "data": {
        "id": 1,
        "score": "GOOD",
        "comment": "Excellent service!",
        "conversation": {
            "id": 1,
            "resource_type": "conversation"
        },
        "creator": {
            "id": 2,
            "resource_type": "user_minimal"
        },
        "created_at": "2015-07-28T06:15:24+05:00",
        "updated_at": "2015-07-28T06:15:24+05:00",
        "resource_type": "conversation_rating",
        "resource_url": "https://brewfictus.kayako.com/api/v1/cases/ratings/1"
    },
    "resource": "conversation_rating"
}
```

## Update a rating

PUT**/api/v1/conversations/:id/ratings/:id.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

Only creator of the conversation is allowed to update rating of their conversation.

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| score | string |  | `GOOD`/`BAD` |
| comment | string |  |  |

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "score": "GOOD",
        "comment": "Excellent service!",
        "conversation": {
            "id": 1,
            "resource_type": "conversation"
        },
        "creator": {
            "id": 2,
            "resource_type": "user_minimal"
        },
        "created_at": "2015-07-28T06:15:24+05:00",
        "updated_at": "2015-07-28T06:15:24+05:00",
        "resource_type": "conversation_rating",
        "resource_url": "https://brewfictus.kayako.com/api/v1/cases/ratings/1"
    },
    "resource": "conversation_rating"
}
```




### Favicon

Title: Favicon - Help Center | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/help_center/favicon/

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   CHANNELS
4.   HELP CENTER

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| size | integer |  |  |
| width | integer |  |  |
| height | integer |  |  |
| type | string |  |  |
| url | string |  |  |
| thumbnails | [Thumbnails](https://developer.kayako.com/api/v1/help_center/favicon/#thumbnails) |  | There will be thumbnails in various dimensions. **Variations:**`32x32`, `46x46`, `72x72`, `96x96`, `144x144` |

## Thumbnails

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| size | integer |  |  |
| width | integer |  |  |
| height | integer |  |  |
| type | string |  | Mime-type of the file |
| url | string |  | The url to view the thumbnail |

## Retrieve favicon

GET**/api/v1/favicon.json**

### Information

Allowed for Public

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| brand_id | integer |  | Favicon for the brand |

### Response

```
{
    "status": 200,
    "data": {
        "name": "favicon.png",
        "size": 730,
        "width": 16,
        "height": 16,
        "type": "image/jpeg",
        "url": "https://brewfictus.kayako.com/api/v1/favicon/render",
        "thumbnails": [
            {
                "name": "favicon-32.png",
                "size": 789,
                "width": 32,
                "height": 32,
                "type": "image/jpeg",
                "url": "https://brewfictus.kayako.com/api/v1/favicon/render&size=32"
            }
        ]
    },
    "resource": "favicon"
}
```

## Render favicon

GET**/api/v1/favicon/render.json**

### Information

Allowed for Public

This output/render image to browser.

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| brand_id | integer |  | Favicon for the brand |

## Replace favicon

PUT**/api/v1/favicon.json**

### Information

Allowed for Admins & Owners

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| image | multipart/form-data |  | Large image will be scaled down **Allowed Image type:**`PNG` |
| brand_id | integer |  | Favicon for the brand |

### Response

```
{
    "status": 200,
    "data": {
        "name": "favicon.png",
        "size": 730,
        "width": 16,
        "height": 16,
        "type": "image/jpeg",
        "url": "https://brewfictus.kayako.com/api/v1/favicon/render",
        "thumbnails": [
            {
                "name": "favicon-32.png",
                "size": 789,
                "width": 32,
                "height": 32,
                "type": "image/jpeg",
                "url": "https://brewfictus.kayako.com/api/v1/favicon/render&size=32"
            }
        ]
    },
    "resource": "favicon"
}
```

## Delete favicon

DELETE**/api/v1/favicon.json**

### Information

Allowed for Admins & Owners

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| brand_id | integer |  | Favicon for the brand |

### Response

```
{
    "status": 200
}
```




### Help Centers

Title: Help Centers - Help Center

URL Source: https://developer.kayako.com/api/v1/help_center/help_centers/

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   CHANNELS
4.   HELP CENTER

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| title | string |  |  |
| brand | [Brand](https://developer.kayako.com/api/v1/general/brands/) |  |  |
| ga_account_id | string |  |  |
| display_messenger | boolean |  |  |
| primary_color | string |  |  |
| font | string |  |  |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve all help centers

GET**/api/v1/helpcenters.json**

### Information

Allowed for Admins & Owners

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "title": "Brewfictus Support",
            "brand": {
                "id": 1,
                "resource_type": "brand"
            },
            "ga_account_id": "12345",
            "display_messenger": true,
            "primary_color": "#4eafcb",
            "font": "Source Sans Pro",
            "created_at": "2016-02-21T11:47:58+05:00",
            "updated_at": "2016-02-21T12:04:08+05:00",
            "resource_type": "help_center",
            "resource_url": "https://brewfictus.kayako.com/api/v1/helpcenter/1"
        }
    ],
    "resource": "help_center",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Retrieve a help center

GET**/api/v1/helpcenters/:id.json**

### Information

Allowed for Admins & Owners

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "title": "Brewfictus Support",
        "brand": {
            "id": 1,
            "resource_type": "brand"
        },
        "ga_account_id": "12345",
        "display_messenger": true,
        "primary_color": "#4eafcb",
        "font": "Source Sans Pro",
        "created_at": "2016-02-21T11:47:58+05:00",
        "updated_at": "2016-02-21T12:04:08+05:00",
        "resource_type": "help_center",
        "resource_url": "https://brewfictus.kayako.com/api/v1/helpcenter/1"
    },
    "resource": "help_center"
}
```

## Update help center

PUT**/api/v1/helpcenters/:id.json**

### Information

Allowed for Admins & Owners

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| title | string |  |  |
| ga_account_id | string |  |  |
| display_messenger | boolean |  |  |
| primary_color | string |  |  |
| font | string |  |  |

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "title": "Brewfictus Support",
        "brand": {
            "id": 1,
            "resource_type": "brand"
        },
        "ga_account_id": "12345",
        "display_messenger": true,
        "primary_color": "#4eafcb",
        "font": "Source Sans Pro",
        "created_at": "2016-02-21T11:47:58+05:00",
        "updated_at": "2016-02-21T12:04:08+05:00",
        "resource_type": "help_center",
        "resource_url": "https://brewfictus.kayako.com/api/v1/helpcenter/1"
    },
    "resource": "help_center"
}
```




### Logo

Title: Logo - Help Center | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/help_center/logo/

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   CHANNELS
4.   HELP CENTER

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| size | integer |  |  |
| width | integer |  |  |
| height | integer |  |  |
| type | string |  |  |
| url | string |  |  |
| thumbnails | [Thumbnails](https://developer.kayako.com/api/v1/help_center/logo/#thumbnails) |  | There will be thumbnails in various dimensions. **Variations:**`75x16`, `113x24`, `150x32` |

## Thumbnails

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| size | integer |  |  |
| width | integer |  | Primary logo width 225 |
| height | integer |  | Primary logo height 48 |
| type | string |  | Mime-type of the file |
| url | string |  | The url to view the thumbnail |

## Render logo

GET**/api/v1/logo/render.json**

### Information

Allowed for Public

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| brand_id | integer |  | Logo for the brand |

### Response

```
{
    "status": 200,
    "data": {
        "name": "logo.png",
        "size": 2954,
        "width": 225,
        "height": 225,
        "type": "image/jpeg",
        "url": "https://brewfictus.kayako.com/api/v1/logo/render",
        "thumbnails": [
            {
                "name": "logo-75.png",
                "size": 1067,
                "width": 75,
                "height": 75,
                "type": "image/jpeg",
                "url": "https://brewfictus.kayako.com/api/v1/logo/render&size=75"
            }
        ]
    },
    "resource": "logo"
}
```

## Retrieve logo

GET**/api/v1/logo.json**

### Information

Allowed for Public

This output/render image to browser.

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| brand_id | integer |  | Logo for the brand |

### Response

```
{
    "status": 200,
    "data": {
        "name": "logo.png",
        "size": 2954,
        "width": 225,
        "height": 225,
        "type": "image/jpeg",
        "url": "https://brewfictus.kayako.com/api/v1/logo/render",
        "thumbnails": [
            {
                "name": "logo-75.png",
                "size": 1067,
                "width": 75,
                "height": 75,
                "type": "image/jpeg",
                "url": "https://brewfictus.kayako.com/api/v1/logo/render&size=75"
            }
        ]
    },
    "resource": "logo"
}
```

## Replace logo

PUT**/api/v1/logo.json**

### Information

Allowed for Admins & Owners

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| image | multipart/form-data |  | Large image will be scaled down |
| brand_id | integer |  | Logo for the brand |

### Response

```
{
    "status": 200,
    "data": {
        "name": "logo.png",
        "size": 2954,
        "width": 225,
        "height": 225,
        "type": "image/jpeg",
        "url": "https://brewfictus.kayako.com/api/v1/logo/render",
        "thumbnails": [
            {
                "name": "logo-75.png",
                "size": 1067,
                "width": 75,
                "height": 75,
                "type": "image/jpeg",
                "url": "https://brewfictus.kayako.com/api/v1/logo/render&size=75"
            }
        ]
    },
    "resource": "logo"
}
```

## Delete logo

DELETE**/api/v1/logo.json**

### Information

Allowed for Admins & Owners

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| brand_id | integer |  | Logo for the brand |

### Response

```
{
    "status": 200
}
```




### Messenger

Title: Messenger - Help Center | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/help_center/messenger/

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   CHANNELS
4.   HELP CENTER

## Settings

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| brand | [Brand](https://developer.kayako.com/api/v1/brands/) |  |  |
| reply_time_expectation | string |  | `AUTO`, `ASAP`, `FEW_MINS`, `FEW_HOURS` **Default:**`AUTO` |
| home_titles | Array of [Field Locales](https://developer.kayako.com/api/v1/general/field_locales/) |  |  |
| home_subtitles | Array of [Field Locales](https://developer.kayako.com/api/v1/general/field_locales/) |  |  |
| businesshour | [Business Hours](https://developer.kayako.com/api/v1/general/business_hours/) |  |  |
| metadata | JSON object |  | Could be any valid [JSON](https://en.wikipedia.org/wiki/JSON) object. JSON arrays are not supported yet. |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve all settings

GET**/api/v1/messenger/settings.json**

### Information

Allowed for Admins & Owners

### Response

```
{
    "status": 200,
    "data": [
        {
            "brand": {
                "id": 1,
                "resource_type": "brand"
            },
            "reply_time_expectation": "AUTO",
            "home_titles": [
                {
                    "id": 1,
                    "resource_type": "locale_field"
                }
            ],
            "home_subtitles": [
                {
                    "id": 1,
                    "resource_type": "locale_field"
                }
            ],
            "businesshour": [
                {
                    "id": 1,
                    "resource_type": "business_hour"
                }
            ],
            "metadata": {
                "widgets": {
                    "presence": {
                        "enabled": true
                    },
                    "twitter": {
                        "enabled": false,
                        "twitterHandle": null
                    },
                    "articles": {
                        "enabled": false,
                        "sectionId": 1
                    }
                },
                "styles": {
                    "primaryColor": "#F1703F",
                    "homeBackground": "-192deg, #40364D 37%, #9B4779 100%",
                    "homePattern": "https://assets.kayako.com/messenger/pattern-1--dark.svg",
                    "homeTextColor": "#FFFFFF"
                }
            }
        }
    ],
    "resource": "messenger_setting",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Retrieve settings for current Brand

GET**/api/v1/messenger/settings/current.json**

Retrieve settings for the Brand associated with the domain.

### Information

Allowed for Public

If no messenger setting exists for the Brand, [RESOURCE_NOT_FOUND](https://developer.kayako.com/api/v1/reference/errors/RESOURCE_NOT_FOUND) is returned.

### Response

```
{
    "status": 200,
    "data": {
        "brand": {
            "id": 1,
            "resource_type": "brand"
        },
        "reply_time_expectation": "AUTO",
        "home_titles": [
            {
                "id": 1,
                "resource_type": "locale_field"
            }
        ],
        "home_subtitles": [
            {
                "id": 1,
                "resource_type": "locale_field"
            }
        ],
        "businesshour": [
            {
                "id": 1,
                "resource_type": "business_hour"
            }
        ],
        "metadata": {
            "widgets": {
                "presence": {
                    "enabled": true
                },
                "twitter": {
                    "enabled": false,
                    "twitterHandle": null
                },
                "articles": {
                    "enabled": false,
                    "sectionId": 1
                }
            },
            "styles": {
                "primaryColor": "#F1703F",
                "homeBackground": "-192deg, #40364D 37%, #9B4779 100%",
                "homePattern": "https://assets.kayako.com/messenger/pattern-1--dark.svg",
                "homeTextColor": "#FFFFFF"
            }
        }
    },
    "resource": "messenger_setting"
}
```

## Update settings for a Brand

PUT**/api/v1/messenger/settings.json**

### Information

Allowed for Admins & Owners

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| brand_id | integer |  |  |
| reply_time_expectation | string |  | `AUTO`, `ASAP`, `FEW_MINS`, `FEW_HOURS` **Default:**`AUTO` |
| home_titles | JSON array |  | e.g. `[{"locale": "en-us", "translation": "Hello"}]` |
| home_subtitles | JSON array |  | e.g. `[{"locale": "en-us", "translation": "How are you"}]` |
| businesshour_id | integer |  |  |
| metadata | JSON object |  | Could be any valid [JSON](https://en.wikipedia.org/wiki/JSON) object. JSON arrays are not supported yet. |

### Request

```
curl -X PUT https://brewfictus.kayako.com/api/v1/messenger/settings.json \
    -d '{"brand_id": 1, "reply_time_expecation": "AUTO", "home_titles": [{"locale": "en-us", "translation": "Hello"}],
    "home_subtitles": [{"locale": "en-us", "translation": "How are you"}], "businesshour_id": 1,
    "metadata": {"widgets":{"presence":{"enabled":true},"twitter":{"enabled":false,"twitterHandle":null},"articles":{"enabled":false,"sectionId":1}},"styles":{"primaryColor":"#F1703F","homeBackground":"-192deg, #40364D 37%, #9B4779 100%","homePattern":"https://assets.kayako.com/messenger/pattern-1--dark.svg","homeTextColor":"#FFFFFF"}} }' \
    -H "Content-Type: application/json" \
    -u "jordan.mitchell@brewfictus.com:jmit6#lsXo"
```

### Response

```
{
    "status": 200,
    "data": {
        "brand": {
            "id": 1,
            "resource_type": "brand"
        },
        "reply_time_expectation": "AUTO",
        "home_titles": [
            {
                "id": 1,
                "resource_type": "locale_field"
            }
        ],
        "home_subtitles": [
            {
                "id": 1,
                "resource_type": "locale_field"
            }
        ],
        "businesshour": [
            {
                "id": 1,
                "resource_type": "business_hour"
            }
        ],
        "metadata": {
            "widgets": {
                "presence": {
                    "enabled": true
                },
                "twitter": {
                    "enabled": false,
                    "twitterHandle": null
                },
                "articles": {
                    "enabled": false,
                    "sectionId": 1
                }
            },
            "styles": {
                "primaryColor": "#F1703F",
                "homeBackground": "-192deg, #40364D 37%, #9B4779 100%",
                "homePattern": "https://assets.kayako.com/messenger/pattern-1--dark.svg",
                "homeTextColor": "#FFFFFF"
            }
        }
    },
    "resource": "messenger_setting"
}
```




### Search

Title: Search - Help Center | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/help_center/search/

Published Time: Thu, 15 Feb 2018 07:35:46 GMT

Markdown Content:
# Search - Help Center | Kayako Developers

[![Image 1](https://developer.kayako.com/img/kayako-logo.png)](https://developer.kayako.com/)

*     
*   [Docs](https://developer.kayako.com/docs/single_sign_on/introduction/)
*   [API](https://developer.kayako.com/api/v1/reference/introduction/)
*   [SDK](https://developer.kayako.com/sdk/java/integration_guide/)
*   [Messenger![Image 2: beta](https://developer.kayako.com/img/new.png)](https://developer.kayako.com/messenger/home/)

*     
*   [Docs](https://developer.kayako.com/docs/single_sign_on/introduction/)
*   [API](https://developer.kayako.com/api/v1/reference/introduction/)
*   [SDK](https://developer.kayako.com/sdk/java/integration_guide/)
*   [Messenger![Image 3: beta](https://developer.kayako.com/img/new.png)](https://developer.kayako.com/messenger/home/)

Help Center

*   [Reference](https://developer.kayako.com/api/v1/reference/introduction/)
Core*   [Users](https://developer.kayako.com/api/v1/users/activities/)
*   [Cases](https://developer.kayako.com/api/v1/cases/activities/)
*   [Insights](https://developer.kayako.com/api/v1/insights/cases/)
*   [Search](https://developer.kayako.com/api/v1/search/search/)
*   [Automation](https://developer.kayako.com/api/v1/automation/endpoints/)
Channels*   [Twitter](https://developer.kayako.com/api/v1/twitter/accounts/)
*   [Facebook](https://developer.kayako.com/api/v1/facebook/accounts/)
*   [Mail](https://developer.kayako.com/api/v1/mail/mailboxes/)
*   [Event](https://developer.kayako.com/api/v1/event/events/)
*   [Help Center](https://developer.kayako.com/api/v1/help_center/articles/)
Others*   [General](https://developer.kayako.com/api/v1/general/autocomplete/)

*   [Articles](https://developer.kayako.com/api/v1/help_center/articles/)
*   [Categories](https://developer.kayako.com/api/v1/help_center/categories/)
*   [Comments](https://developer.kayako.com/api/v1/help_center/comments/)
*   [Conversations](https://developer.kayako.com/api/v1/help_center/conversations/)
*   [Favicon](https://developer.kayako.com/api/v1/help_center/favicon/)
*   [Help Centers](https://developer.kayako.com/api/v1/help_center/help_centers/)
*   [Logo](https://developer.kayako.com/api/v1/help_center/logo/)
*   [Messenger](https://developer.kayako.com/api/v1/help_center/messenger/)
*   [Search](https://developer.kayako.com/api/v1/help_center/search/)
    *   [Resource fields](https://developer.kayako.com/api/v1/help_center/search/#resource-fields)
    *   [Search](https://developer.kayako.com/api/v1/help_center/search/#Search)

*   [Sections](https://developer.kayako.com/api/v1/help_center/sections/)
*   [Templates](https://developer.kayako.com/api/v1/help_center/templates/)
*   [Users](https://developer.kayako.com/api/v1/help_center/users/)

1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   CHANNELS
4.   HELP CENTER

# Search

## Resource Fields

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| uuid | string |  |  |
| title | string |  |  |
| contents | string |  |  |
| link | string |  |  |
| original | Resource |  | Original resource like [Articles](https://developer.kayako.com/api/v1/help_center/articles/), [Conversations](https://developer.kayako.com/api/v1/help_center/conversations/) |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Metadata

Version 1.0
Last Updated July 04, 2016

## Actions

## Search

GET**/api/v1/helpcenter/search.json**

### Information

Allowed for Public

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| query | string |  | Length should be at least 3 chars |
| in | string |  | `CONVERSATIONS`, `ARTICLES`, `ALL` **Default:**`ALL` |
| locale | string |  |  |

### Response

```text
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "resource_type": "article"
        }
    ],
    "resource": "search",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

 Copyright © 2018 [Kayako](http://www.kayako.com/). All rights reserved • [Privacy Policy](http://www.kayako.com/about/privacy)

[](https://www.facebook.com/kayako/)[](https://twitter.com/kayako)




### Sections

Title: Sections - Help Center | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/help_center/sections/

Published Time: Thu, 15 Feb 2018 07:35:46 GMT

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   CHANNELS
4.   HELP CENTER

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| titles | [Field Locales](https://developer.kayako.com/api/v1/general/field_locales/) |  |  |
| legacy_id | string |  |  |
| slugs | [Field Locales](https://developer.kayako.com/api/v1/general/field_locales/) |  |  |
| descriptions | [Field Locales](https://developer.kayako.com/api/v1/general/field_locales/) |  |  |
| visibility | string |  | `PUBLIC`, `AUTHORIZED`, `AGENTS` **Default:**`PUBLIC` |
| teams | [Teams](https://developer.kayako.com/api/v1/help_center/sections/#teams) |  |  |
| tags | [Tags](https://developer.kayako.com/api/v1/help_center/sections/#tags) |  |  |
| category | [Category](https://developer.kayako.com/api/v1/help_center/categories/) |  |  |
| agent | [User](https://developer.kayako.com/api/v1/users/users/) |  |  |
| article_order_by | string |  | `LATEST`, `POPULAR`, **Default:**`LATEST` |
| total_articles | integer |  |  |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |

## Teams

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| title | string |  |  |
| members | [User](https://developer.kayako.com/api/v1/users/users/) |  |  |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve all sections

GET**/api/v1/sections.json**

### Information

Allowed for Public
Ordered by created_at (ascending)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| category_id | integer |  | **DEPRECATION**: This field will be removed soon, use `category_ids` instead. |
| category_ids | string |  | Comma-separated list of category IDs to filter by |

**OR**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| legacy_ids | string |  | The comma separated legacy ids |

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "legacy_id": null,
            "titles": [
                {
                    "id": 1,
                    "resource_type": "locale_field"
                }
            ],
            "slugs": [
                {
                    "locale": "en-us",
                    "translation": "1-brewing-equipment",
                    "resource_type": "slug"
                }
            ],
            "descriptions": [
                {
                    "id": 1,
                    "resource_type": "locale_field"
                }
            ],
            "visibility": "PUBLIC",
            "teams": [],
            "tags": [],
            "category": {
                "id": 1,
                "resource_type": "category"
            },
            "agent": {
                "id": 1,
                "resource_type": "user_minimal"
            },
            "article_order_by": "LATEST",
            "total_articles": 2,
            "created_at": "2016-04-13T07:32:51+00:00",
            "updated_at": "2016-04-13T07:32:51+00:00",
            "resource_type": "section",
            "resource_url": "https://brewfictus.kayako.com/api/v1/sections/1"
        }
    ],
    "resource": "section",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Retrieve a section

GET**/api/v1/sections/:id.json**

### Information

Allowed for Public

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "legacy_id": null,
        "titles": [
            {
                "id": 1,
                "resource_type": "locale_field"
            }
        ],
        "slugs": [
            {
                "locale": "en-us",
                "translation": "1-brewing-equipment",
                "resource_type": "slug"
            }
        ],
        "descriptions": [
            {
                "id": 1,
                "resource_type": "locale_field"
            }
        ],
        "visibility": "PUBLIC",
        "teams": [],
        "tags": [],
        "category": {
            "id": 1,
            "resource_type": "category"
        },
        "agent": {
            "id": 1,
            "resource_type": "user_minimal"
        },
        "article_order_by": "LATEST",
        "total_articles": 2,
        "created_at": "2016-04-13T07:32:51+00:00",
        "updated_at": "2016-04-13T07:32:51+00:00",
        "resource_type": "section",
        "resource_url": "https://brewfictus.kayako.com/api/v1/sections/1"
    },
    "resource": "section"
}
```

## Add a section

POST**/api/v1/sections.json**

### Information

Allowed for Agents, Admins & Owners

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| titles | string |  |  |
| category_id | integer |  |  |
| legacy_id | string |  |  |
| descriptions | string |  |  |
| visibility | string |  | `PUBLIC`, `AUTHORIZED`, `AGENTS` **Default:**`PUBLIC` |
| tags | string |  | Comma separated value of tags. **NOTE:** Allowed for visibility `AUTHORIZED` and `AGENTS` otherwise server will ignore the tags |
| team_ids | string |  | Comma separated value of team ids. **NOTE:** Allowed for visibility `AGENTS` otherwise server will ignore the teams |
| article_order_by | string |  | `LATEST`, `POPULAR` **Default:**`LATEST` |

### Request

```
curl -X POST https://brewfictus.kayako.com/api/v1/sections.json \
    -d '{"titles":[{"locale":"en-us", "translation": "Brewing equipment"}], "descriptions":[{"locale":"en-us", "translation": "Brewing equipment description"}],"category_id":1, "tags": "", "team_ids": ""}' \
    -H "Content-Type: application/json" \
    -u "jordan.mitchell@brewfictus.com:jmit6#lsXo"
```

### Response

```
{
    "status": 201,
    "data": {
        "id": 1,
        "legacy_id": null,
        "titles": [
            {
                "id": 1,
                "resource_type": "locale_field"
            }
        ],
        "slugs": [
            {
                "locale": "en-us",
                "translation": "1-brewing-equipment",
                "resource_type": "slug"
            }
        ],
        "descriptions": [
            {
                "id": 1,
                "resource_type": "locale_field"
            }
        ],
        "visibility": "PUBLIC",
        "teams": [],
        "tags": [],
        "category": {
            "id": 1,
            "resource_type": "category"
        },
        "agent": {
            "id": 1,
            "resource_type": "user_minimal"
        },
        "article_order_by": "LATEST",
        "total_articles": 2,
        "created_at": "2016-04-13T07:32:51+00:00",
        "updated_at": "2016-04-13T07:32:51+00:00",
        "resource_type": "section",
        "resource_url": "https://brewfictus.kayako.com/api/v1/sections/1"
    },
    "resource": "section"
}
```

## Bulk add sections

POST**/api/v1/bulk/sections.json**

### Information

Allowed for Agents, Admins & Owners

You can insert a maximum of 200 sections at a time

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| sections | array |  | Array of sections to be inserted |

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| partial_import | boolean |  | By default, even if a single record is invalid, the entire batch is dropped. However, if this parameter is set to `true`, all the records with no validation errors will be inserted while the invalid records will be returned back. |

### Request

```
curl -X POST https://brewfictus.kayako.com/api/v1/bulk/sections \
    -d '{"sections": [{"titles": [{"locale": "en-us", "translation": "Example Section"}], "tags": "", "team_ids": "", "category_id": 1, "creator_id": 1, "legacy_id": "section_1"}]}' \
    -H "Content-Type: application/json"
```

### Response

```
{
    "status": 202,
    "data": {
        "id": 1,
        "status": "PENDING",
        "created_at": "2015-07-30T06:45:25+05:00",
        "updated_at": "2015-07-30T06:45:25+05:00",
        "resource_type": "bulk_job",
        "resource_url": "https://brewfictus.kayako.com/api/v1/jobs/1"
    },
    "resource": "job"
}
```

## Update a section

PUT**/api/v1/sections/:id.json**

### Information

Allowed for Agents, Admins & Owners

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| titles | string |  |  |
| category_id | integer |  |  |
| descriptions | string |  |  |
| visibility | string |  | `PUBLIC`, `AUTHORIZED`, `AGENTS` |
| tags | string |  | Comma separated value of tags. **NOTE:** Allowed for visibility `AUTHORIZED` and `AGENTS` otherwise server will ignore the tags |
| team_ids | string |  | Comma separated value of team ids. **NOTE:** Allowed for visibility `AGENTS` otherwise server will ignore the teams |
| article_order_by | string |  | `LATEST`, `POPULAR`, `MANUAL` |

### Request

```
curl -X PUT https://brewfictus.kayako.com/api/v1/sections/1.json \
    -d '{"titles":[{"locale":"en-us", "translation": "Getting started"}], "descriptions":[{"locale":"en-us", "translation": "Getting started description"}],"category_id":1, "tags": "", "team_ids": ""}' \
    -H "Content-Type: application/json" \
    -u "jordan.mitchell@brewfictus.com:jmit6#lsXo"
```

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "legacy_id": null,
        "titles": [
            {
                "id": 1,
                "resource_type": "locale_field"
            }
        ],
        "slugs": [
            {
                "locale": "en-us",
                "translation": "1-brewing-equipment",
                "resource_type": "slug"
            }
        ],
        "descriptions": [
            {
                "id": 1,
                "resource_type": "locale_field"
            }
        ],
        "visibility": "PUBLIC",
        "teams": [],
        "tags": [],
        "category": {
            "id": 1,
            "resource_type": "category"
        },
        "agent": {
            "id": 1,
            "resource_type": "user_minimal"
        },
        "article_order_by": "LATEST",
        "total_articles": 2,
        "created_at": "2016-04-13T07:32:51+00:00",
        "updated_at": "2016-04-13T07:32:51+00:00",
        "resource_type": "section",
        "resource_url": "https://brewfictus.kayako.com/api/v1/sections/1"
    },
    "resource": "section"
}
```

## Update sections

PUT**/api/v1/sections.json**

### Information

Allowed for Agents, Admins & Owners

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| category_id | integer |  |  |
| visibility | string |  | `PUBLIC`, `AUTHORIZED`, `AGENTS` |
| tags | string |  | Comma separated value of tags. **NOTE:** Allowed for visibility `AUTHORIZED` and `AGENTS` otherwise server will ignore the tags |
| team_ids | string |  | Comma separated value of team ids. **NOTE:** Allowed for visibility `AGENTS` otherwise server will ignore the teams |
| article_order_by | string |  | `LATEST`, `POPULAR`, `MANUAL` |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```

## Delete a section

DELETE**/api/v1/sections/:id.json**

### Information

Allowed for Agents, Admins & Owners

_Note:_ All articles in the section will also be deleted.

### Response

```
{
    "status": 200
}
```

## Delete sections

DELETE**/api/v1/sections.json**

### Information

Allowed for Agents, Admins & Owners

_Note:_ All articles in the section will also be deleted.

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```

## Reorder Sections

PUT**/api/v1/sections/reorder.json**

### Information

Allowed for Agents, Admins & Owners

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| section_ids | string |  | Pass the section ids in order you want to set |
| section_id | integer |  | If not specified then the default brand will be applicable |

### Response

```
{
    "status": 200
}
```




### Templates

Title: Templates - Help Center | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/help_center/templates/

Markdown Content:
# Templates - Help Center | Kayako Developers

[![Image 1](https://developer.kayako.com/img/kayako-logo.png)](https://developer.kayako.com/)

*     
*   [Docs](https://developer.kayako.com/docs/single_sign_on/introduction/)
*   [API](https://developer.kayako.com/api/v1/reference/introduction/)
*   [SDK](https://developer.kayako.com/sdk/java/integration_guide/)
*   [Messenger![Image 2: beta](https://developer.kayako.com/img/new.png)](https://developer.kayako.com/messenger/home/)

 --- 

*     
*   [Docs](https://developer.kayako.com/docs/single_sign_on/introduction/)
*   [API](https://developer.kayako.com/api/v1/reference/introduction/)
*   [SDK](https://developer.kayako.com/sdk/java/integration_guide/)
*   [Messenger![Image 3: beta](https://developer.kayako.com/img/new.png)](https://developer.kayako.com/messenger/home/)

Help Center

*   [Reference](https://developer.kayako.com/api/v1/reference/introduction/)
Core*   [Users](https://developer.kayako.com/api/v1/users/activities/)
*   [Cases](https://developer.kayako.com/api/v1/cases/activities/)
*   [Insights](https://developer.kayako.com/api/v1/insights/cases/)
*   [Search](https://developer.kayako.com/api/v1/search/search/)
*   [Automation](https://developer.kayako.com/api/v1/automation/endpoints/)
Channels*   [Twitter](https://developer.kayako.com/api/v1/twitter/accounts/)
*   [Facebook](https://developer.kayako.com/api/v1/facebook/accounts/)
*   [Mail](https://developer.kayako.com/api/v1/mail/mailboxes/)
*   [Event](https://developer.kayako.com/api/v1/event/events/)
*   [Help Center](https://developer.kayako.com/api/v1/help_center/articles/)
Others*   [General](https://developer.kayako.com/api/v1/general/autocomplete/)

*   [Articles](https://developer.kayako.com/api/v1/help_center/articles/)
*   [Categories](https://developer.kayako.com/api/v1/help_center/categories/)
*   [Comments](https://developer.kayako.com/api/v1/help_center/comments/)
*   [Conversations](https://developer.kayako.com/api/v1/help_center/conversations/)
*   [Favicon](https://developer.kayako.com/api/v1/help_center/favicon/)
*   [Help Centers](https://developer.kayako.com/api/v1/help_center/help_centers/)
*   [Logo](https://developer.kayako.com/api/v1/help_center/logo/)
*   [Messenger](https://developer.kayako.com/api/v1/help_center/messenger/)
*   [Search](https://developer.kayako.com/api/v1/help_center/search/)
*   [Sections](https://developer.kayako.com/api/v1/help_center/sections/)
*   [Templates](https://developer.kayako.com/api/v1/help_center/templates/)
    *   [Resource fields](https://developer.kayako.com/api/v1/help_center/templates/#resource-fields)
    *   [Retrieve templates](https://developer.kayako.com/api/v1/help_center/templates/#Retrieve-templates)
    *   [Retrieve a template](https://developer.kayako.com/api/v1/help_center/templates/#Retrieve-a-template)
    *   [Update a template](https://developer.kayako.com/api/v1/help_center/templates/#Update-a-template)
    *   [Restore a template](https://developer.kayako.com/api/v1/help_center/templates/#Restore-a-template)

*   [Users](https://developer.kayako.com/api/v1/help_center/users/)

1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   CHANNELS
4.   HELP CENTER

# Templates

## Resource Fields

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| app | string |  |  |
| category | string |  |  |
| contents | string |  |  |
| is_custom | boolean |  |  |

## Metadata

Version 1.0
Last Updated July 04, 2016

## Actions

## Retrieve templates

GET**/api/v1/brands/:id/templates.json**

### Information

Allowed for Admins & Owners
Scope[configuration](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Response

```text
{
    "status": 200,
    "data": [
        {
            "name": "helpcenter_main",
            "app": "HelpCenter",
            "category": "main",
            "contents": "<html><a>header</a> ......",
            "is_custom": false,
            "resource_type": "template",
            "resource_url": "https://brewfictus.kayako.com/api/v1/brands/1/templates/helpcenter_main"
        }
    ],
    "resource": "template",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Retrieve a template

GET**/api/v1/brands/:id/templates/:name.json**

### Information

Allowed for Admins & Owners
Scope[configuration](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Response

```text
{
    "status": 200,
    "data": {
        "name": "helpcenter_main",
        "app": "HelpCenter",
        "category": "main",
        "contents": "<html><a>header</a> ......",
        "is_custom": false,
        "resource_type": "template",
        "resource_url": "https://brewfictus.kayako.com/api/v1/brands/1/templates/helpcenter_main"
    },
    "resource": "template"
}
```

## Update a template

PUT**/api/v1/brands/:id/templates/:name.json**

### Information

Allowed for Admins & Owners
Scope[configuration](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| contents | string |  |  |

### Response

```text
{
    "status": 200,
    "data": {
        "name": "helpcenter_main",
        "app": "HelpCenter",
        "category": "main",
        "contents": "<html><a>header</a> ......",
        "is_custom": false,
        "resource_type": "template",
        "resource_url": "https://brewfictus.kayako.com/api/v1/brands/1/templates/helpcenter_main"
    },
    "resource": "template"
}
```

## Restore a template

PUT**/api/v1/brands/:id/templates/:name/restore.json**

### Information

Allowed for Admins & Owners
Scope[configuration](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| version_id | int |  | To restore to a specific version, pass the id returned from the versions endpoint. If the ID isn't passed, the original (default) template is restored. |

### Response

```text
{
    "status": 200,
    "data": {
        "name": "helpcenter_main",
        "app": "HelpCenter",
        "category": "main",
        "contents": "<html><a>header</a> ......",
        "is_custom": false,
        "resource_type": "template",
        "resource_url": "https://brewfictus.kayako.com/api/v1/brands/1/templates/helpcenter_main"
    },
    "resource": "template"
}
```

 Copyright © 2018 [Kayako](http://www.kayako.com/). All rights reserved • [Privacy Policy](http://www.kayako.com/about/privacy)

[](https://www.facebook.com/kayako/)[](https://twitter.com/kayako)




### Users

Title: Users - Help Center | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/help_center/users/

Markdown Content:
# Users - Help Center | Kayako Developers

[![Image 1](https://developer.kayako.com/img/kayako-logo.png)](https://developer.kayako.com/)

*     
*   [Docs](https://developer.kayako.com/docs/single_sign_on/introduction/)
*   [API](https://developer.kayako.com/api/v1/reference/introduction/)
*   [SDK](https://developer.kayako.com/sdk/java/integration_guide/)
*   [Messenger![Image 2: beta](https://developer.kayako.com/img/new.png)](https://developer.kayako.com/messenger/home/)

*     
*   [Docs](https://developer.kayako.com/docs/single_sign_on/introduction/)
*   [API](https://developer.kayako.com/api/v1/reference/introduction/)
*   [SDK](https://developer.kayako.com/sdk/java/integration_guide/)
*   [Messenger![Image 3: beta](https://developer.kayako.com/img/new.png)](https://developer.kayako.com/messenger/home/)

Help Center

*   [Reference](https://developer.kayako.com/api/v1/reference/introduction/)
Core*   [Users](https://developer.kayako.com/api/v1/users/activities/)
*   [Cases](https://developer.kayako.com/api/v1/cases/activities/)
*   [Insights](https://developer.kayako.com/api/v1/insights/cases/)
*   [Search](https://developer.kayako.com/api/v1/search/search/)
*   [Automation](https://developer.kayako.com/api/v1/automation/endpoints/)
Channels*   [Twitter](https://developer.kayako.com/api/v1/twitter/accounts/)
*   [Facebook](https://developer.kayako.com/api/v1/facebook/accounts/)
*   [Mail](https://developer.kayako.com/api/v1/mail/mailboxes/)
*   [Event](https://developer.kayako.com/api/v1/event/events/)
*   [Help Center](https://developer.kayako.com/api/v1/help_center/articles/)
Others*   [General](https://developer.kayako.com/api/v1/general/autocomplete/)

*   [Articles](https://developer.kayako.com/api/v1/help_center/articles/)
*   [Categories](https://developer.kayako.com/api/v1/help_center/categories/)
*   [Comments](https://developer.kayako.com/api/v1/help_center/comments/)
*   [Conversations](https://developer.kayako.com/api/v1/help_center/conversations/)
*   [Favicon](https://developer.kayako.com/api/v1/help_center/favicon/)
*   [Help Centers](https://developer.kayako.com/api/v1/help_center/help_centers/)
*   [Logo](https://developer.kayako.com/api/v1/help_center/logo/)
*   [Messenger](https://developer.kayako.com/api/v1/help_center/messenger/)
*   [Search](https://developer.kayako.com/api/v1/help_center/search/)
*   [Sections](https://developer.kayako.com/api/v1/help_center/sections/)
*   [Templates](https://developer.kayako.com/api/v1/help_center/templates/)
*   [Users](https://developer.kayako.com/api/v1/help_center/users/)
    *   [Resource fields](https://developer.kayako.com/api/v1/help_center/users/#resource-fields)
    *   [Register a user](https://developer.kayako.com/api/v1/help_center/users/#Register-a-user)

1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   CHANNELS
4.   HELP CENTER

# Users

## Resource Fields

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| full_name | string |  |  |
| email | [Email](https://developer.kayako.com/api/v1/users/profile/#Emails) |  |  |
| locale | string |  |  |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Metadata

Version 1.0
Last Updated July 04, 2016

## Actions

## Register a user

POST**/api/v1/helpcenter/register.json**

### Information

Allowed for Public

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| full_name | string |  |  |
| email | string |  |  |
| locale | string |  |  |

### Response

```text
{
    "status": 201,
    "data": {
        "id": 13,
        "full_name": "John Doe",
        "email": {
            "id": 1,
            "resource_type": "identity_email"
        },
        "locale": "en-us",
        "created_at": "2015-06-09T13:10:35+05:00",
        "resource_type": "user"
    },
    "resource": "user"
}
```

 Copyright © 2018 [Kayako](http://www.kayako.com/). All rights reserved • [Privacy Policy](http://www.kayako.com/about/privacy)

[](https://www.facebook.com/kayako/)[](https://twitter.com/kayako)




---

## Others / General


### Autocomplete

Title: Autocomplete - General | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/general/autocomplete/

Published Time: Thu, 15 Feb 2018 07:35:46 GMT

Markdown Content:
```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "uuid": "11b60c25-c44c-47b8-9f48-56631cd7fa01",
            "full_name": "Simon Blackhouse",
            "legacy_id": null,
            "designation": "Community Manager",
            "is_enabled": true,
            "is_mfa_enabled": true,
            "role": {
                "id": 2,
                "resource_type": "role"
            },
            "avatar": "https://brewfictus.kayako.com/avatar/get/24ee2d81-ad95-5ae1-a07e-7ccedcdb70b8",
            "agent_case_access": "ALL",
            "organization_case_access": null,
            "organization": {
                "id": 1,
                "resource_type": "organization"
            },
            "teams": [],
            "emails": [
                {
                    "id": 1,
                    "resource_type": "identity_email"
                }
            ],
            "phones": [
                {
                    "id": 1,
                    "resource_type": "identity_phone"
                }
            ],
            "twitter": [],
            "facebook": [],
            "external_identifiers": [],
            "addresses": [
                {
                    "id": 1,
                    "resource_type": "contact_address"
                }
            ],
            "websites": [
                {
                    "id": 1,
                    "resource_type": "contact_website"
                }
            ],
            "custom_fields": [
                {
                    "field": {
                        "id": 1,
                        "resource_type": "user_field"
                    },
                    "value": "Customer Success",
                    "resource_type": "user_field_value"
                }
            ],
            "pinned_notes_count": 0,
            "locale": "en-us",
            "time_zone": null,
            "time_zone_offset": null,
            "greeting": null,
            "signature": null,
            "status_message": null,
            "last_seen_user_agent": null,
            "last_seen_ip": null,
            "last_seen_at": null,
            "last_active_at": null,
            "realtime_channel": "presence-0c1c9535b26b749f815a22cb459a4a8084be77b6ac9515751ef5a743b190bef3@v1_users_6",
            "presence_channel": "user_presence-281f395f6f51d031a6d3db3489906c98285191ebac41bb744f9323f61af63433@5c98cdaa58dd91ff1119a476e8b3e305d2906d3b",
            "password_updated_at": "2016-03-15T10:38:01+05:00",
            "avatar_updated_at": null,
            "last_logged_in_at": null,
            "last_activity_at": null,
            "created_at": "2016-03-15T10:38:01+05:00",
            "updated_at": "2016-03-15T10:38:01+05:00",
            "resource_type": "user",
            "resource_url": "https://brewfictus.kayako.com/api/v1/users/1"
        }
    ],
    "resource": "user",
    "total_count": 1
}
```




### Brands

Title: Brands - General | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/general/brands/

Published Time: Thu, 15 Feb 2018 07:35:46 GMT

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   OTHER
4.   GENERAL

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| subdomain | string |  |  |
| domain | string |  |  |
| alias | string |  |  |
| locale | [Locale](https://developer.kayako.com/api/v1/general/locales/) |  |  |
| is_ssl_enabled | boolean |  | `True` if SSL certificate is uploaded |
| is_default | boolean |  | **Default:**`false` |
| is_enabled | boolean |  | **Default:**`true` |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve all brands

GET**/api/v1/brands.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners
Scope[configuration](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "name": "Default",
            "sub_domain": "brewfictus",
            "domain": "kayako.com",
            "alias": null,
            "locale": {
                "id": 1,
                "resource_type": "locale"
            },
            "is_ssl_enabled": true,
            "is_default": true,
            "is_enabled": true,
            "created_at": "2015-07-27T11:35:09+05:00",
            "updated_at": "2015-07-27T11:35:09+05:00",
            "resource_type": "brand",
            "resource_url": "https://brewfictus.kayako.com/api/v1/brands/1"
        }
    ],
    "resource": "brand",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Retrieve a brand

GET**/api/v1/brands/:id.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners
Scope[configuration](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "name": "Default",
        "sub_domain": "brewfictus",
        "domain": "kayako.com",
        "alias": null,
        "locale": {
            "id": 1,
            "resource_type": "locale"
        },
        "is_ssl_enabled": true,
        "is_default": true,
        "is_enabled": true,
        "created_at": "2015-07-27T11:35:09+05:00",
        "updated_at": "2015-07-27T11:35:09+05:00",
        "resource_type": "brand",
        "resource_url": "https://brewfictus.kayako.com/api/v1/brands/1"
    },
    "resource": "brand"
}
```

## Check domain availability

POST**/api/v1/brands/available.json**

### Information

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| sub_domain | string |  |  |

### Response

```
{
    "status": 200
}
```

## Validate alias

POST**/api/v1/brands/validate.json**

### Information

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| sub_domain | string |  |  |
| alias | string |  | Alias should have a valid CNAME set to domain |

### Response

```
{
    "status": 200
}
```

## Add a brand

POST**/api/v1/brands.json**

### Information

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| sub_domain | string |  |  |
| alias | string |  |  |
| locale_id | integer |  | [Locales](https://developer.kayako.com/api/v1/general/locales) |
| ssl_certificate | string |  | base64 encoded, mandatory to pass if alias provided |
| private_key | string |  | base64 encoded, mandatory to pass if alias provided |

### Response

```
{
    "status": 201,
    "data": {
        "id": 1,
        "name": "Default",
        "sub_domain": "brewfictus",
        "domain": "kayako.com",
        "alias": null,
        "locale": {
            "id": 1,
            "resource_type": "locale"
        },
        "is_ssl_enabled": true,
        "is_default": true,
        "is_enabled": true,
        "created_at": "2015-07-27T11:35:09+05:00",
        "updated_at": "2015-07-27T11:35:09+05:00",
        "resource_type": "brand",
        "resource_url": "https://brewfictus.kayako.com/api/v1/brands/1"
    },
    "resource": "brand"
}
```

## Update a brand

PUT**/api/v1/brands/:id.json**

### Information

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| alias | string |  |  |
| locale_id | integer |  | [Locales](https://developer.kayako.com/api/v1/general/locales) |
| ssl_certificate | string |  | base64 encoded, mandatory to pass if alias changed |
| private_key | string |  | base64 encoded, mandatory to pass if alias changed |
| is_enabled | boolean |  |  |
| is_default | boolean |  |  |

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "name": "Default",
        "sub_domain": "brewfictus",
        "domain": "kayako.com",
        "alias": null,
        "locale": {
            "id": 1,
            "resource_type": "locale"
        },
        "is_ssl_enabled": true,
        "is_default": true,
        "is_enabled": true,
        "created_at": "2015-07-27T11:35:09+05:00",
        "updated_at": "2015-07-27T11:35:09+05:00",
        "resource_type": "brand",
        "resource_url": "https://brewfictus.kayako.com/api/v1/brands/1"
    },
    "resource": "brand"
}
```

## Get SSL Certificate

GET**/api/v1/brands/:id/certificate.json**

### Information

### Response

```
{
    "status": 200,
    "data": {
        "certificate": "---- DUMMY CERTIFICATE CONTENT HERE ----"
    },
    "resource": "ssl_certificate"
}
```

## Mass action on brands

PUT**/api/v1/brands.json**

### Information

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  |  |

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| is_enabled | boolean |  |  |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```

## Delete a brand

DELETE**/api/v1/brands/:id.json**

### Information

_Note:_ Brand set as default cannot be deleted.

### Response

```
{
    "status": 200
}
```

## Delete brands

DELETE**/api/v1/brands.json**

### Information

_Note:_ Brand set as default cannot be deleted.

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```




### Business Hours

Title: Business Hours - General | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/general/business_hours/

Published Time: Thu, 15 Feb 2018 07:35:46 GMT

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   OTHER
4.   GENERAL

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| title | string |  |  |
| zones | [Zones](https://developer.kayako.com/api/v1/general/business_hours/#zones) |  |  |
| holidays | [Holidays](https://developer.kayako.com/api/v1/general/business_hours/#Holidays) |  |  |
| is_default | boolean |  |  |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Zones

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| monday | array |  |  |
| tuesday | array |  |  |
| wednesday | array |  |  |
| thursday | array |  |  |
| friday | array |  |  |
| saturday | array |  |  |
| sunday | array |  |  |

## Retrieve all business hours

GET**/api/v1/businesshours.json**

### Information

Allowed for Admins & Owners
Scope[configuration](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)
Ordered by id (ascending)

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "title": "US office hours",
            "zones": {
                "monday": [
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16,
                    17,
                    18
                ],
                "tuesday": [
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16,
                    17,
                    18
                ],
                "wednesday": [
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16,
                    17,
                    18
                ],
                "thursday": [
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16,
                    17,
                    18
                ],
                "friday": [
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16,
                    17,
                    18
                ],
                "saturday": [],
                "sunday": []
            },
            "holidays": [],
            "is_default": true,
            "created_at": "2015-07-21T07:10:42+05:00",
            "updated_at": "2015-07-21T07:10:42+05:00",
            "resource_type": "business_hour",
            "resource_url": "https://brewfictus.kayako.com/api/v1/businesshours/1"
        }
    ],
    "resource": "business_hour",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Retrieve a business hour

GET**/api/v1/businesshours/:id.json**

### Information

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "title": "US office hours",
        "zones": {
            "monday": [
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17,
                18
            ],
            "tuesday": [
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17,
                18
            ],
            "wednesday": [
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17,
                18
            ],
            "thursday": [
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17,
                18
            ],
            "friday": [
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17,
                18
            ],
            "saturday": [],
            "sunday": []
        },
        "holidays": [],
        "is_default": true,
        "created_at": "2015-07-21T07:10:42+05:00",
        "updated_at": "2015-07-21T07:10:42+05:00",
        "resource_type": "business_hour",
        "resource_url": "https://brewfictus.kayako.com/api/v1/businesshours/1"
    },
    "resource": "business_hour"
}
```

## Add a business hour

POST**/api/v1/businesshours.json**

### Information

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| title | string |  |  |
| zones | string |  | JSON encoded object of open hours with keys as day and values as array of open hours. At least one open hour must be specified. The json array elements should have a key value pair of days and open hours array where days should be out of `monday, tuesday, wednesday, thursday, friday, saturday, sunday` and open hour values must be between 0 and 23. **Example:** `{"monday": [9, 10, 11, 12], "tuesday": [13, 14, 15, 16], "wednesday": [17, 18, 19, 20]}` |
| holidays | array |  | Holidays are specified as an array of [holidays](https://developer.kayako.com/api/v1/general/business_hours/#Holidays). **Example:** `[{ "title": "Festivus", "date": "23/12/2016" , "open_hours": [1,2,0]}, { "title": "Christmas", "date": "25/12/2016" }]` |

### Response

```
{
    "status": 201,
    "data": {
        "id": 1,
        "title": "US office hours",
        "zones": {
            "monday": [
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17,
                18
            ],
            "tuesday": [
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17,
                18
            ],
            "wednesday": [
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17,
                18
            ],
            "thursday": [
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17,
                18
            ],
            "friday": [
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17,
                18
            ],
            "saturday": [],
            "sunday": []
        },
        "holidays": [],
        "is_default": true,
        "created_at": "2015-07-21T07:10:42+05:00",
        "updated_at": "2015-07-21T07:10:42+05:00",
        "resource_type": "business_hour",
        "resource_url": "https://brewfictus.kayako.com/api/v1/businesshours/1"
    },
    "resource": "business_hour"
}
```

## Update a business hour

PUT**/api/v1/businesshours/:id.json**

### Information

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| title | string |  |  |
| zones | string |  | Existing zones are replaced with the given ones. So make sure you specify all zones you want to get updated. The json object elements should have a key value pair of days and open hours array where days should be out of `monday, tuesday, wednesday, thursday, friday, saturday, sunday` and open hour values must be between 0 and 23. **Example:** `{"monday": [9, 10, 11, 12], "tuesday": [13, 14, 15, 16], "wednesday": [17, 18, 19, 20]}` |
| holidays | array |  | Holidays are specified as an array of [holidays](https://developer.kayako.com/api/v1/general/business_hours/#Holidays). **Example:** `[{ "title": "Festivus", "date": "23/12/2016" , "open_hours": [1,2,0]}, { "title": "Christmas", "date": "25/12/2016" }]` |
| is_default | boolean |  |  |

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "title": "US office hours",
        "zones": {
            "monday": [
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17,
                18
            ],
            "tuesday": [
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17,
                18
            ],
            "wednesday": [
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17,
                18
            ],
            "thursday": [
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17,
                18
            ],
            "friday": [
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17,
                18
            ],
            "saturday": [],
            "sunday": []
        },
        "holidays": [],
        "is_default": true,
        "created_at": "2015-07-21T07:10:42+05:00",
        "updated_at": "2015-07-21T07:10:42+05:00",
        "resource_type": "business_hour",
        "resource_url": "https://brewfictus.kayako.com/api/v1/businesshours/1"
    },
    "resource": "business_hour"
}
```

## Delete a business hour

DELETE**/api/v1/businesshours/:id.json**

### Information

### Response

```
{
    "status": 200
}
```

## Delete business hours

DELETE**/api/v1/businesshours.json**

### Information

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```




### Field Locales

Title: Field Locales - General | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/general/field_locales/

Published Time: Thu, 15 Feb 2018 07:35:46 GMT

Markdown Content:
# Field Locales - General | Kayako Developers

[![Image 1](https://developer.kayako.com/img/kayako-logo.png)](https://developer.kayako.com/)

*     
*   [Docs](https://developer.kayako.com/docs/single_sign_on/introduction/)
*   [API](https://developer.kayako.com/api/v1/reference/introduction/)
*   [SDK](https://developer.kayako.com/sdk/java/integration_guide/)
*   [Messenger![Image 2: beta](https://developer.kayako.com/img/new.png)](https://developer.kayako.com/messenger/home/)

*     
*   [Docs](https://developer.kayako.com/docs/single_sign_on/introduction/)
*   [API](https://developer.kayako.com/api/v1/reference/introduction/)
*   [SDK](https://developer.kayako.com/sdk/java/integration_guide/)
*   [Messenger![Image 3: beta](https://developer.kayako.com/img/new.png)](https://developer.kayako.com/messenger/home/)

General

*   [Reference](https://developer.kayako.com/api/v1/reference/introduction/)
Core*   [Users](https://developer.kayako.com/api/v1/users/activities/)
*   [Cases](https://developer.kayako.com/api/v1/cases/activities/)
*   [Insights](https://developer.kayako.com/api/v1/insights/cases/)
*   [Search](https://developer.kayako.com/api/v1/search/search/)
*   [Automation](https://developer.kayako.com/api/v1/automation/endpoints/)
Channels*   [Twitter](https://developer.kayako.com/api/v1/twitter/accounts/)
*   [Facebook](https://developer.kayako.com/api/v1/facebook/accounts/)
*   [Mail](https://developer.kayako.com/api/v1/mail/mailboxes/)
*   [Event](https://developer.kayako.com/api/v1/event/events/)
*   [Help Center](https://developer.kayako.com/api/v1/help_center/articles/)
Others*   [General](https://developer.kayako.com/api/v1/general/autocomplete/)

*   [Autocomplete](https://developer.kayako.com/api/v1/general/autocomplete/)
*   [Brands](https://developer.kayako.com/api/v1/general/brands/)
*   [Business Hours](https://developer.kayako.com/api/v1/general/business_hours/)
*   [Field Locales](https://developer.kayako.com/api/v1/general/field_locales/)
    *   [Resource fields](https://developer.kayako.com/api/v1/general/field_locales/#resource-fields)
    *   [Retrieve field locales](https://developer.kayako.com/api/v1/general/field_locales/#Retrieve-field-locales)
    *   [Retrieve a field locale](https://developer.kayako.com/api/v1/general/field_locales/#Retrieve-a-field-locale)

*   [Files](https://developer.kayako.com/api/v1/general/files/)
*   [Locales](https://developer.kayako.com/api/v1/general/locales/)
*   [Oauth](https://developer.kayako.com/api/v1/general/oauth/)
*   [Sessions](https://developer.kayako.com/api/v1/general/sessions/)
*   [Settings](https://developer.kayako.com/api/v1/general/settings/)
*   [Tests](https://developer.kayako.com/api/v1/general/tests/)

1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   OTHER
4.   GENERAL

# Field Locales

## Resource Fields

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| locale | string |  |  |
| translation | string |  |  |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Metadata

Version 1.0
Last Updated July 04, 2016

## Actions

## Retrieve field locales

GET**/api/v1/locale/fields.json**

### Information

Allowed for Admins & Owners

### Response

```text
{
    "status": 200,
    "data": [],
    "resource": "locale_field",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Retrieve a field locale

GET**/api/v1/locale/fields/:id.json**

### Information

Allowed for Admins & Owners

### Response

```text
{
    "status": 200,
    "data": {
        "id": 1,
        "locale": "en-us",
        "translation": "Industry",
        "created_at": "2015-11-05T10:48:34+05:00",
        "updated_at": "2015-11-05T10:48:34+05:00",
        "resource_type": "locale_field",
        "resource_url": "https://brewfictus.kayako.com/api/v1/locale/fields/1"
    },
    "resource": "locale_field"
}
```

 Copyright © 2018 [Kayako](http://www.kayako.com/). All rights reserved • [Privacy Policy](http://www.kayako.com/about/privacy)

[](https://www.facebook.com/kayako/)[](https://twitter.com/kayako)




### Files

Title: Files - General | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/general/files/

Published Time: Thu, 15 Feb 2018 07:35:46 GMT

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   OTHER
4.   GENERAL

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| size | integer |  |  |
| content_type | string |  |  |
| content | binary |  |  |
| content_url | string |  | URL for file download |
| hash | string |  | Unique hash that identifies the file |
| group_hash | string |  | Always `s:<session-id>` |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| expiry_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve all files

GET**/api/v1/files.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "name": "coffee.png",
            "size": 2347,
            "content_type": "image/png",
            "content": "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAI8klEQVRYw8WXa4yU1RnHf+e9zbxz2ZnZ2+zM7gKCy6JQsChWbCti1CpaNRooTWttq1L7pemnGq2JsbYWTJNaG61py4ciTdXaRG2td7EiK7KC3FZYYIBlWdidvc798r7vOf2wFxZEyocmnuQkczl5nv/zf/7neZ4jlFJ8kUvjC17GS3997nP/DIZCZHNZtm7tZMmXF7Hq7u//X51v2/QfjPM+LcSZv1hAHIgBJpADUoB3viZ1XT8/AEIINO20bDUBc4AIYEwAGAN6gdLkobUPPUK8rg4hBGcqTSnFZVcsOQ8NTASu6TrdHVvYuP4vk9rJAaOAAxwE3rlr5bdLn37YwRO/eIw9H2whEAxiBwP4AwHsadsfsLH8PnTD+N8MKAUKEEJDN01Mn+9SHO5V0psvTL0VDRM4mj5+cqNhWX8wLR+mz4dpWRiGgW4YZ7GpJlKgfT4ApcYPSinxXA9PqhfQtJULWuv56O2XqGuME0skcMtlirlsUnrulY8/8sDTQ2OFqlSsVPDKOVMqNLZ/tP1cDCikVDiu+9Cau+98NECJkZEeylUHQwNNOdQlWwCd0sgwI+mT9A8eh6prrb712pcHMpWy50lbehKhiSnH01MrBBinq0ONf1UglcKT8k+L57fdU0inaF4wn3hzlO7OHXR+0EFv3zFy2WG+ccftJGfNJRCKkEg0EQg10NfbjSpl/DetuE51bNkmdE0gNIGu62hCIKWa2oaU3nT/qAkQSrH0Swvm3dN34GOWrrierRs38MBPH+C9jHsaT//eupfbVq1GUxVMJ0fEdlj1nR/TNLed7n3dXHr5ZSqTzYhEYwObOz/irdfeZM1992C6Hq7rYESTTVPCUEoRb20mlx4m4Au83HtoN+1zZvHg9dfx6027P5Ok1voAi792HbWJOeiGQSWf4cWNv+VXT7zO+sd+wlfv+B4DozmkJ++XnrcOQBNiPFClUIppDEzQLj0PKb0nUbLBNDTW//JnZ3V+6/LLWf2DNYSCEY70HCEzPEzX7u3sO1xmFLjvwSf5vecxb/ktRBub1yrprVNy4kpNJluIaRpQCqRESbXBFwzf6ZUqyNIgL766dapphIG6mJ9YQy3hunpKxRJ2MMjBfXvZ8OcNZKbpqR9Y/7un+Pm8hbTUzUYEbCU9z/Sk5yp1CojBxJ1U4wy0ZUaG75w960JOHDlOcWyMPTk1BaCh1mTx0iUEgzGGsxle/NuzRGJ1SM9BnqWp7hsCtzQGwiCebOKKZVc5b7z6upCeN1ULxKZNm8YJUSBdqRItSZqamti9bQcxLc+3brqNbudUUWwKmwRtP5Wqw4yZM4jWNxAO1VAsZtm5dQvHcqcAtAl4s/MNdh+uovs1IpEa2tvnsnt75/1+JR6XqGkMSHmR3/Yxe+YsMrkMwUgY4YV4v/Nd4pdcMykTTuYcyDnYwMKFYfyWxejoAGOD/TiV0xlYces1RJMLOPL283jCo5Itkh8bpba+bl0hnX5cKYXhSTle8Tzv3lg0hlQSy7BACHrS/STiC9j2ynNcfsvq04yXgJ0fb6fqwJgz3hCmrzDw6G+eYXPHDq6+dhk6gp5UipBlYmqC5bfdAlKiWZbFxP56srWVUqGIaRiUyiWkAQOFIrPnfYVs6hC337ziNCd9RRg8i/On1j5GdmSYD3ftJ1gXZm57O8nmBLFIDYFQiLntbRtwXXAcjGRDA2q86sXDwQD5XIGT/f3k8zkidoiqW2VrdxdLF17CP/75KgDFE32819HBzr17qToO9bUxFi9axJVLr4RgCApl3tn8PkXpUe8PsuuTT8hlsvgtk6pUKNPanCnkkVIhdm/fDoCU8kC8ubmtkC8SCgfpPd5Luj/N6MgwMy+YhWH5qLGDWLrGBS3N6JHI6WF7HgNHjzGYzVAFstkshaEhrr/5Rrr3drHn024amupZdMkSCkPpu5RSGxRg2KaFGBdY3/Fjx9rq6uvx+20SzS0oqRgZGebg/gM0xRPUtkfx2wFSA2lKx3op5PK4ThXbbxMMBbGDIeKJBL19fXz47iYCAZuhDRvRTJNwNMrMWXOwTMFotdI7OWEZpqFNzhyvaUpdraTEk4r6WAwhJZqus6+ri8Opg2RGx5jTfiHhaATb58O2TFzXIxQOkGhsoeqW+GTHTl547nl0IWhrn4vwmdTW1tMYj9Pa0kxPKoUQYudUUzywa+pzQ7VSTet+PzV19SSTCaQnGUwPkB4c5GjqMD1Hj+K5HoFwiEgkgm3bGJZBpVTB9TwOdR+g+0A3zYkEcy+6iEg0SihSQzLRQjQaRrguJ3p6dvgD/kuZ4N2Y7NMCBl3p3ZdNp5+RjkNjUyOGrhNPJAiEw9REa0jOaKXnUIqjPT309PRQzBdASaqOgwLq6utZtuwq4okE4VAYOxSgrb2dmlCYg11dDA0MYFjWg0JoU9VXpPbuGU+BEOQLBYrF8mvlUvGGhsZGLl60CHR9SmflUpHMWJbBwUGy2SyZzBiViouuC/y2TTgSIhAIYVs+fH4fM2bOBOD4oUMcSaXQDONfdiDwzVDQnqx/iPfeenNq7BYTbCjHfUEJuTIWiTLjgguJNjZ8ps471SqlUgnHcUCArumYloll+jAtc+rc/l276D9xAmCz0vXlgHeqGSkMTdOmZv7JgUno+qpioXL/sDe8Npsr0FBXR2MySSwenzJsWhamZZ19mvNgbGSQ1P79ZLJZSpXKHz34USQcngp2sncZ4swHhxgHouvauhPDY+vDfv+zUqkbhoaGCYUOUxOJEKutJVBTg2VZgIbnOZQrZYqZLIPpNPlcjnw+R6FcPVIsFb8bjUQ6lOeNszvZBScBKKX4LAiBEAJd04ZM07yx6+DB5rBtrwmHgj8MpodbdLMXf9CPqesopRBAuVyiWq5QLFcplIt/zxdKT5Y854NEbS3ahL2zvg3PCuCMF5Gu632WZT28L3X4YUOIoNC0i/2W1Wro+gxNCJ8Q4mS+XDzhunJ/xXWPz58zh0rFoarGo+Zz7AMYUinEuUBMANE1DUPXMXW9IDSt07KsTmNiyhVCYHouAhcJaJqG0MTk9T7n+i9E3g5FqneL1QAAAABJRU5ErkJggg==",
            "content_url": "https://brewfictus.kayako.com/api/v1/files/1/content",
            "hash": "njfm3olrtyx6xong0qgyxop3g4cx7oqq",
            "group_hash": "s:eqLyhuWTm4pCxpNFPfTOqw1m7J0tr7ecbcd391681ad6abbaf45aa19e7120421c038c25ncb2oeC5J0uD0nODSw",
            "created_at": "2015-08-27T09:27:48+05:00",
            "expiry_at": "2015-08-27T12:27:48+05:00",
            "resource_type": "file",
            "resource_url": "https://brewfictus.kayako.com/api/v1/files/1"
        }
    ],
    "resource": "file",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Retrieve a file

GET**/api/v1/files/:id.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "name": "coffee.png",
        "size": 2347,
        "content_type": "image/png",
        "content": "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAI8klEQVRYw8WXa4yU1RnHf+e9zbxz2ZnZ2+zM7gKCy6JQsChWbCti1CpaNRooTWttq1L7pemnGq2JsbYWTJNaG61py4ciTdXaRG2td7EiK7KC3FZYYIBlWdidvc798r7vOf2wFxZEyocmnuQkczl5nv/zf/7neZ4jlFJ8kUvjC17GS3997nP/DIZCZHNZtm7tZMmXF7Hq7u//X51v2/QfjPM+LcSZv1hAHIgBJpADUoB3viZ1XT8/AEIINO20bDUBc4AIYEwAGAN6gdLkobUPPUK8rg4hBGcqTSnFZVcsOQ8NTASu6TrdHVvYuP4vk9rJAaOAAxwE3rlr5bdLn37YwRO/eIw9H2whEAxiBwP4AwHsadsfsLH8PnTD+N8MKAUKEEJDN01Mn+9SHO5V0psvTL0VDRM4mj5+cqNhWX8wLR+mz4dpWRiGgW4YZ7GpJlKgfT4ApcYPSinxXA9PqhfQtJULWuv56O2XqGuME0skcMtlirlsUnrulY8/8sDTQ2OFqlSsVPDKOVMqNLZ/tP1cDCikVDiu+9Cau+98NECJkZEeylUHQwNNOdQlWwCd0sgwI+mT9A8eh6prrb712pcHMpWy50lbehKhiSnH01MrBBinq0ONf1UglcKT8k+L57fdU0inaF4wn3hzlO7OHXR+0EFv3zFy2WG+ccftJGfNJRCKkEg0EQg10NfbjSpl/DetuE51bNkmdE0gNIGu62hCIKWa2oaU3nT/qAkQSrH0Swvm3dN34GOWrrierRs38MBPH+C9jHsaT//eupfbVq1GUxVMJ0fEdlj1nR/TNLed7n3dXHr5ZSqTzYhEYwObOz/irdfeZM1992C6Hq7rYESTTVPCUEoRb20mlx4m4Au83HtoN+1zZvHg9dfx6027P5Ok1voAi792HbWJOeiGQSWf4cWNv+VXT7zO+sd+wlfv+B4DozmkJ++XnrcOQBNiPFClUIppDEzQLj0PKb0nUbLBNDTW//JnZ3V+6/LLWf2DNYSCEY70HCEzPEzX7u3sO1xmFLjvwSf5vecxb/ktRBub1yrprVNy4kpNJluIaRpQCqRESbXBFwzf6ZUqyNIgL766dapphIG6mJ9YQy3hunpKxRJ2MMjBfXvZ8OcNZKbpqR9Y/7un+Pm8hbTUzUYEbCU9z/Sk5yp1CojBxJ1U4wy0ZUaG75w960JOHDlOcWyMPTk1BaCh1mTx0iUEgzGGsxle/NuzRGJ1SM9BnqWp7hsCtzQGwiCebOKKZVc5b7z6upCeN1ULxKZNm8YJUSBdqRItSZqamti9bQcxLc+3brqNbudUUWwKmwRtP5Wqw4yZM4jWNxAO1VAsZtm5dQvHcqcAtAl4s/MNdh+uovs1IpEa2tvnsnt75/1+JR6XqGkMSHmR3/Yxe+YsMrkMwUgY4YV4v/Nd4pdcMykTTuYcyDnYwMKFYfyWxejoAGOD/TiV0xlYces1RJMLOPL283jCo5Itkh8bpba+bl0hnX5cKYXhSTle8Tzv3lg0hlQSy7BACHrS/STiC9j2ynNcfsvq04yXgJ0fb6fqwJgz3hCmrzDw6G+eYXPHDq6+dhk6gp5UipBlYmqC5bfdAlKiWZbFxP56srWVUqGIaRiUyiWkAQOFIrPnfYVs6hC337ziNCd9RRg8i/On1j5GdmSYD3ftJ1gXZm57O8nmBLFIDYFQiLntbRtwXXAcjGRDA2q86sXDwQD5XIGT/f3k8zkidoiqW2VrdxdLF17CP/75KgDFE32819HBzr17qToO9bUxFi9axJVLr4RgCApl3tn8PkXpUe8PsuuTT8hlsvgtk6pUKNPanCnkkVIhdm/fDoCU8kC8ubmtkC8SCgfpPd5Luj/N6MgwMy+YhWH5qLGDWLrGBS3N6JHI6WF7HgNHjzGYzVAFstkshaEhrr/5Rrr3drHn024amupZdMkSCkPpu5RSGxRg2KaFGBdY3/Fjx9rq6uvx+20SzS0oqRgZGebg/gM0xRPUtkfx2wFSA2lKx3op5PK4ThXbbxMMBbGDIeKJBL19fXz47iYCAZuhDRvRTJNwNMrMWXOwTMFotdI7OWEZpqFNzhyvaUpdraTEk4r6WAwhJZqus6+ri8Opg2RGx5jTfiHhaATb58O2TFzXIxQOkGhsoeqW+GTHTl547nl0IWhrn4vwmdTW1tMYj9Pa0kxPKoUQYudUUzywa+pzQ7VSTet+PzV19SSTCaQnGUwPkB4c5GjqMD1Hj+K5HoFwiEgkgm3bGJZBpVTB9TwOdR+g+0A3zYkEcy+6iEg0SihSQzLRQjQaRrguJ3p6dvgD/kuZ4N2Y7NMCBl3p3ZdNp5+RjkNjUyOGrhNPJAiEw9REa0jOaKXnUIqjPT309PRQzBdASaqOgwLq6utZtuwq4okE4VAYOxSgrb2dmlCYg11dDA0MYFjWg0JoU9VXpPbuGU+BEOQLBYrF8mvlUvGGhsZGLl60CHR9SmflUpHMWJbBwUGy2SyZzBiViouuC/y2TTgSIhAIYVs+fH4fM2bOBOD4oUMcSaXQDONfdiDwzVDQnqx/iPfeenNq7BYTbCjHfUEJuTIWiTLjgguJNjZ8ps471SqlUgnHcUCArumYloll+jAtc+rc/l276D9xAmCz0vXlgHeqGSkMTdOmZv7JgUno+qpioXL/sDe8Npsr0FBXR2MySSwenzJsWhamZZ19mvNgbGSQ1P79ZLJZSpXKHz34USQcngp2sncZ4swHhxgHouvauhPDY+vDfv+zUqkbhoaGCYUOUxOJEKutJVBTg2VZgIbnOZQrZYqZLIPpNPlcjnw+R6FcPVIsFb8bjUQ6lOeNszvZBScBKKX4LAiBEAJd04ZM07yx6+DB5rBtrwmHgj8MpodbdLMXf9CPqesopRBAuVyiWq5QLFcplIt/zxdKT5Y854NEbS3ahL2zvg3PCuCMF5Gu632WZT28L3X4YUOIoNC0i/2W1Wro+gxNCJ8Q4mS+XDzhunJ/xXWPz58zh0rFoarGo+Zz7AMYUinEuUBMANE1DUPXMXW9IDSt07KsTmNiyhVCYHouAhcJaJqG0MTk9T7n+i9E3g5FqneL1QAAAABJRU5ErkJggg==",
        "content_url": "https://brewfictus.kayako.com/api/v1/files/1/content",
        "hash": "njfm3olrtyx6xong0qgyxop3g4cx7oqq",
        "group_hash": "s:eqLyhuWTm4pCxpNFPfTOqw1m7J0tr7ecbcd391681ad6abbaf45aa19e7120421c038c25ncb2oeC5J0uD0nODSw",
        "created_at": "2015-08-27T09:27:48+05:00",
        "expiry_at": "2015-08-27T12:27:48+05:00",
        "resource_type": "file",
        "resource_url": "https://brewfictus.kayako.com/api/v1/files/1"
    },
    "resource": "file"
}
```

## Download a file

GET**/api/v1/files/:id/content.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners

Dispatches the file to the API client using the standard HTTP protocol (i.e. triggers usual file download).

## Add a file

POST**/api/v1/files.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| name | string |  | The file name |
| content | buffer |  | The content of the file |

### Upload

File resources can be created not only by providing values for `name` and `content` resource fields, but also by uploading files using the following scenarios:

*   Providing the content as the request body, and the name in the `Content-Disposition` HTTP header or in the special `_filename` argument.
*   Using the standard HTTP `multipart/form-data` format of the request. With this format you can upload multiple files at once.

Check [File Upload](https://developer.kayako.com/api/v1/reference/file_upload#single-step-uploading-2) for details.

### Response

```
{
    "status": 201,
    "data": {
        "id": 1,
        "name": "coffee.png",
        "size": 2347,
        "content_type": "image/png",
        "content": "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAI8klEQVRYw8WXa4yU1RnHf+e9zbxz2ZnZ2+zM7gKCy6JQsChWbCti1CpaNRooTWttq1L7pemnGq2JsbYWTJNaG61py4ciTdXaRG2td7EiK7KC3FZYYIBlWdidvc798r7vOf2wFxZEyocmnuQkczl5nv/zf/7neZ4jlFJ8kUvjC17GS3997nP/DIZCZHNZtm7tZMmXF7Hq7u//X51v2/QfjPM+LcSZv1hAHIgBJpADUoB3viZ1XT8/AEIINO20bDUBc4AIYEwAGAN6gdLkobUPPUK8rg4hBGcqTSnFZVcsOQ8NTASu6TrdHVvYuP4vk9rJAaOAAxwE3rlr5bdLn37YwRO/eIw9H2whEAxiBwP4AwHsadsfsLH8PnTD+N8MKAUKEEJDN01Mn+9SHO5V0psvTL0VDRM4mj5+cqNhWX8wLR+mz4dpWRiGgW4YZ7GpJlKgfT4ApcYPSinxXA9PqhfQtJULWuv56O2XqGuME0skcMtlirlsUnrulY8/8sDTQ2OFqlSsVPDKOVMqNLZ/tP1cDCikVDiu+9Cau+98NECJkZEeylUHQwNNOdQlWwCd0sgwI+mT9A8eh6prrb712pcHMpWy50lbehKhiSnH01MrBBinq0ONf1UglcKT8k+L57fdU0inaF4wn3hzlO7OHXR+0EFv3zFy2WG+ccftJGfNJRCKkEg0EQg10NfbjSpl/DetuE51bNkmdE0gNIGu62hCIKWa2oaU3nT/qAkQSrH0Swvm3dN34GOWrrierRs38MBPH+C9jHsaT//eupfbVq1GUxVMJ0fEdlj1nR/TNLed7n3dXHr5ZSqTzYhEYwObOz/irdfeZM1992C6Hq7rYESTTVPCUEoRb20mlx4m4Au83HtoN+1zZvHg9dfx6027P5Ok1voAi792HbWJOeiGQSWf4cWNv+VXT7zO+sd+wlfv+B4DozmkJ++XnrcOQBNiPFClUIppDEzQLj0PKb0nUbLBNDTW//JnZ3V+6/LLWf2DNYSCEY70HCEzPEzX7u3sO1xmFLjvwSf5vecxb/ktRBub1yrprVNy4kpNJluIaRpQCqRESbXBFwzf6ZUqyNIgL766dapphIG6mJ9YQy3hunpKxRJ2MMjBfXvZ8OcNZKbpqR9Y/7un+Pm8hbTUzUYEbCU9z/Sk5yp1CojBxJ1U4wy0ZUaG75w960JOHDlOcWyMPTk1BaCh1mTx0iUEgzGGsxle/NuzRGJ1SM9BnqWp7hsCtzQGwiCebOKKZVc5b7z6upCeN1ULxKZNm8YJUSBdqRItSZqamti9bQcxLc+3brqNbudUUWwKmwRtP5Wqw4yZM4jWNxAO1VAsZtm5dQvHcqcAtAl4s/MNdh+uovs1IpEa2tvnsnt75/1+JR6XqGkMSHmR3/Yxe+YsMrkMwUgY4YV4v/Nd4pdcMykTTuYcyDnYwMKFYfyWxejoAGOD/TiV0xlYces1RJMLOPL283jCo5Itkh8bpba+bl0hnX5cKYXhSTle8Tzv3lg0hlQSy7BACHrS/STiC9j2ynNcfsvq04yXgJ0fb6fqwJgz3hCmrzDw6G+eYXPHDq6+dhk6gp5UipBlYmqC5bfdAlKiWZbFxP56srWVUqGIaRiUyiWkAQOFIrPnfYVs6hC337ziNCd9RRg8i/On1j5GdmSYD3ftJ1gXZm57O8nmBLFIDYFQiLntbRtwXXAcjGRDA2q86sXDwQD5XIGT/f3k8zkidoiqW2VrdxdLF17CP/75KgDFE32819HBzr17qToO9bUxFi9axJVLr4RgCApl3tn8PkXpUe8PsuuTT8hlsvgtk6pUKNPanCnkkVIhdm/fDoCU8kC8ubmtkC8SCgfpPd5Luj/N6MgwMy+YhWH5qLGDWLrGBS3N6JHI6WF7HgNHjzGYzVAFstkshaEhrr/5Rrr3drHn024amupZdMkSCkPpu5RSGxRg2KaFGBdY3/Fjx9rq6uvx+20SzS0oqRgZGebg/gM0xRPUtkfx2wFSA2lKx3op5PK4ThXbbxMMBbGDIeKJBL19fXz47iYCAZuhDRvRTJNwNMrMWXOwTMFotdI7OWEZpqFNzhyvaUpdraTEk4r6WAwhJZqus6+ri8Opg2RGx5jTfiHhaATb58O2TFzXIxQOkGhsoeqW+GTHTl547nl0IWhrn4vwmdTW1tMYj9Pa0kxPKoUQYudUUzywa+pzQ7VSTet+PzV19SSTCaQnGUwPkB4c5GjqMD1Hj+K5HoFwiEgkgm3bGJZBpVTB9TwOdR+g+0A3zYkEcy+6iEg0SihSQzLRQjQaRrguJ3p6dvgD/kuZ4N2Y7NMCBl3p3ZdNp5+RjkNjUyOGrhNPJAiEw9REa0jOaKXnUIqjPT309PRQzBdASaqOgwLq6utZtuwq4okE4VAYOxSgrb2dmlCYg11dDA0MYFjWg0JoU9VXpPbuGU+BEOQLBYrF8mvlUvGGhsZGLl60CHR9SmflUpHMWJbBwUGy2SyZzBiViouuC/y2TTgSIhAIYVs+fH4fM2bOBOD4oUMcSaXQDONfdiDwzVDQnqx/iPfeenNq7BYTbCjHfUEJuTIWiTLjgguJNjZ8ps471SqlUgnHcUCArumYloll+jAtc+rc/l276D9xAmCz0vXlgHeqGSkMTdOmZv7JgUno+qpioXL/sDe8Npsr0FBXR2MySSwenzJsWhamZZ19mvNgbGSQ1P79ZLJZSpXKHz34USQcngp2sncZ4swHhxgHouvauhPDY+vDfv+zUqkbhoaGCYUOUxOJEKutJVBTg2VZgIbnOZQrZYqZLIPpNPlcjnw+R6FcPVIsFb8bjUQ6lOeNszvZBScBKKX4LAiBEAJd04ZM07yx6+DB5rBtrwmHgj8MpodbdLMXf9CPqesopRBAuVyiWq5QLFcplIt/zxdKT5Y854NEbS3ahL2zvg3PCuCMF5Gu632WZT28L3X4YUOIoNC0i/2W1Wro+gxNCJ8Q4mS+XDzhunJ/xXWPz58zh0rFoarGo+Zz7AMYUinEuUBMANE1DUPXMXW9IDSt07KsTmNiyhVCYHouAhcJaJqG0MTk9T7n+i9E3g5FqneL1QAAAABJRU5ErkJggg==",
        "content_url": "https://brewfictus.kayako.com/api/v1/files/1/content",
        "hash": "njfm3olrtyx6xong0qgyxop3g4cx7oqq",
        "group_hash": "s:eqLyhuWTm4pCxpNFPfTOqw1m7J0tr7ecbcd391681ad6abbaf45aa19e7120421c038c25ncb2oeC5J0uD0nODSw",
        "created_at": "2015-08-27T09:27:48+05:00",
        "expiry_at": "2015-08-27T12:27:48+05:00",
        "resource_type": "file",
        "resource_url": "https://brewfictus.kayako.com/api/v1/files/1"
    },
    "resource": "file"
}
```

## Delete a file

DELETE**/api/v1/files/:id.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Response

```
{
    "status": 200
}
```

## Delete files

DELETE**/api/v1/files.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | array |  | Array of IDs |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```




### Locales

Title: Locales - General | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/general/locales/

Published Time: Thu, 15 Feb 2018 07:35:46 GMT

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   OTHER
4.   GENERAL

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| locale | string |  |  |
| flag_icon | string |  |  |
| name | string |  |  |
| native_name | string |  |  |
| region | string |  |  |
| native_region | string |  |  |
| script | string |  |  |
| variant | string |  |  |
| direction | string |  | `RTL`, `LTR` |
| is_public | boolean |  | Indicates that the locale is available to customers |
| is_localized | boolean |  | Indicates whether or not the agent area is available in this locale |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve locales

GET**/api/v1/locales.json**

### Information

Allowed for Public

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| is_public | boolean |  |  |
| is_localized | boolean |  |  |

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "locale": "en-us",
            "name": "English",
            "native_name": "English (United States)",
            "region": "US",
            "native_region": "United States",
            "script": "",
            "variant": "",
            "direction": "ltr",
            "is_public": true,
            "is_localized": true,
            "created_at": "2016-03-15T06:09:23Z",
            "updated_at": "2016-03-15T06:09:23Z",
            "resource_type": "locale",
            "resource_url": "https://brewfictus.kayako.com/api/v1/locales/1"
        }
    ],
    "resource": "locale",
    "total_count": 2
}
```

## Retrieve a locale

GET**/api/v1/locales/:id.json**

### Information

Allowed for Public

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "locale": "en-us",
        "name": "English",
        "native_name": "English (United States)",
        "region": "US",
        "native_region": "United States",
        "script": "",
        "variant": "",
        "direction": "ltr",
        "is_public": true,
        "is_localized": true,
        "created_at": "2016-03-15T06:09:23Z",
        "updated_at": "2016-03-15T06:09:23Z",
        "resource_type": "locale",
        "resource_url": "https://brewfictus.kayako.com/api/v1/locales/1"
    },
    "resource": "locale"
}
```

## Retrieve a user locale

GET**/api/v1/locales/current.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "locale": "en-us",
        "name": "English",
        "native_name": "English (United States)",
        "region": "US",
        "native_region": "United States",
        "script": "",
        "variant": "",
        "direction": "ltr",
        "is_public": true,
        "is_localized": true,
        "created_at": "2016-03-15T06:09:23Z",
        "updated_at": "2016-03-15T06:09:23Z",
        "resource_type": "locale",
        "resource_url": "https://brewfictus.kayako.com/api/v1/locales/1"
    },
    "resource": "locale"
}
```

## Update locale

PUT**/api/v1/locales/id.json**

### Information

Allowed for Admins & Owners

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| is_public | boolean |  |  |

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "locale": "en-us",
        "name": "English",
        "native_name": "English (United States)",
        "region": "US",
        "native_region": "United States",
        "script": "",
        "variant": "",
        "direction": "ltr",
        "is_public": true,
        "is_localized": true,
        "created_at": "2016-03-15T06:09:23Z",
        "updated_at": "2016-03-15T06:09:23Z",
        "resource_type": "locale",
        "resource_url": "https://brewfictus.kayako.com/api/v1/locales/1"
    },
    "resource": "locale"
}
```

## Strings

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| id | string |  |  |
| value | string |  |  |

## Retrieve strings

GET**/api/v1/locales/:id/strings.json**

### Information

Allowed for Public

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| filter | string |  | Can be used to filter locales for only required ones. Allowed Values: `MESSENGER` |

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": "core.universal.accesslog.create",
            "value": "Created by %s on %s",
            "resource_type": "locale_string"
        },
        {
            "id": "core.universal.accesslog.update",
            "value": "Last Updated by %s on %s",
            "resource_type": "locale_string"
        }
    ],
    "resource": "locale_string",
    "total_count": 2
}
```

## Retrieve user strings

GET**/api/v1/locales/current/strings.json**

### Information

Allowed for Public

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": "core.universal.accesslog.create",
            "value": "Created by %s on %s",
            "resource_type": "locale_string"
        }
    ],
    "resource": "locale_string",
    "total_count": 1
}
```




### OAuth

Title: Oauth - General | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/general/oauth/

Published Time: Thu, 15 Feb 2018 07:35:46 GMT

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   OTHER
4.   GENERAL

## Clients

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  | The title of the client application |
| url | string |  | The URL to the page about the client application |
| key | string |  |  |
| secret | string |  | **Shown only once** |
| scopes | array |  | [API scopes](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1) |
| logo | [Logo](https://developer.kayako.com/api/v1/general/oauth/#logo) |  |  |
| description | string |  | Short description of what the application does |
| author | string |  | The name of the author of the client application |
| author_url | string |  | The URL to the page about the author |
| callback_url | string |  | The URL of the client application, that will handle OAuth redirects |
| creator | [User](https://developer.kayako.com/api/v1/users/users/) |  |  |
| last_used_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Logo

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| data | buffer |  |  |
| type | string |  | `JPEG`, `PNG` or `GIF` |
| url | string |  | The URL to view the logo |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve all clients

GET**/api/v1/oauth/clients.json**

### Information

Allowed for Admins & Owners

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "name": "Brewfictus mobile app",
            "url": "https://brewfictus.com/apps/kayako",
            "key": "c054173c-89d2-48c2-b020-1ce3f7874462",
            "secret": null,
            "scopes": [],
            "logo": {
                "url": "https://brewfictus.kayako.com/api/v1/oauth/clients/1/logo",
                "created_at": "2016-12-29T16:07:04+00:00"
            },
            "description": "Support client for mobile devices",
            "author": "Brewfictus",
            "author_url": "https://brewfictus.com",
            "callback_url": "https://brewfictus.com/oauth/callback",
            "creator": {
                "id": 1,
                "resource_type": "user"
            },
            "last_used_at": null,
            "created_at": "2016-12-29T16:06:27+00:00",
            "updated_at": null,
            "resource_type": "oauth_client",
            "resource_url": "https://brewfictus.kayako.com/api/v1/oauth/clients/1"
        }
    ],
    "resource": "oauth_client",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Retrieve a client

GET**/api/v1/oauth/clients/:id.json**

### Information

Allowed for Admins & Owners

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "name": "Brewfictus mobile app",
        "url": "https://brewfictus.com/apps/kayako",
        "key": "c054173c-89d2-48c2-b020-1ce3f7874462",
        "secret": null,
        "scopes": [],
        "logo": {
            "url": "https://brewfictus.kayako.com/api/v1/oauth/clients/1/logo",
            "created_at": "2016-12-29T16:07:04+00:00"
        },
        "description": "Support client for mobile devices",
        "author": "Brewfictus",
        "author_url": "https://brewfictus.com",
        "callback_url": "https://brewfictus.com/oauth/callback",
        "creator": {
            "id": 1,
            "resource_type": "user"
        },
        "last_used_at": null,
        "created_at": "2016-12-29T16:06:27+00:00",
        "updated_at": null,
        "resource_type": "oauth_client",
        "resource_url": "https://brewfictus.kayako.com/api/v1/oauth/clients/1"
    },
    "resource": "oauth_client"
}
```

## Add a client

POST**/api/v1/oauth/clients.json**

### Information

Allowed for Admins & Owners

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| name | string |  | The title of the client application |
| url | string |  | The URL to the page about the client application |
| scopes | array |  | [API scopes](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1) allowed for this application |
| description | string |  | Short description of what the application does |
| author | string |  | The name of the author of the client application |
| author_url | string |  | The URL to the page about the author |
| callback_url | string |  | The URL of the client application, that will handle OAuth redirects |
| logo | [File Upload](https://developer.kayako.com/api/v1/reference/file_upload) |  | Image larger than `100x100` will be scaled down |
| logo_file_id | integer |  | The ID of the image file, see [Two-step upload](https://developer.kayako.com/api/v1/reference/file_upload/#two-step-upload-1) |

### Response

```
{
    "status": 201,
    "data": {
        "id": 1,
        "name": "Brewfictus mobile app",
        "url": "https://brewfictus.com/apps/kayako",
        "key": "c054173c-89d2-48c2-b020-1ce3f7874462",
        "secret": "NGQzMDJjYzMtOTAxZS00OGEyLThjNTUtMjkyMzMxN2MyYTA5ZDAxNDhmMWQtYjljNC00MGUxLWFjMTYtMDZjMWRhNjU4Y2Rj",
        "scopes": [],
        "logo": {
            "url": "https://brewfictus.kayako.com/api/v1/oauth/clients/1/logo",
            "created_at": "2016-12-29T16:07:04+00:00"
        },
        "description": "Support client for mobile devices",
        "author": "Brewfictus",
        "author_url": "https://brewfictus.com",
        "callback_url": "https://brewfictus.com/oauth/callback",
        "creator": {
            "id": 1,
            "resource_type": "user"
        },
        "last_used_at": null,
        "created_at": "2016-12-29T16:06:27+00:00",
        "updated_at": null,
        "resource_type": "oauth_client",
        "resource_url": "https://brewfictus.kayako.com/api/v1/oauth/clients/1"
    },
    "resource": "oauth_client"
}
```

## Update a client

PUT**/api/v1/oauth/clients/:id.json**

### Information

Allowed for Admins & Owners

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| name | string |  | The title of the client application |
| url | string |  | The URL to the page about the client application |
| scopes | array |  | [API scopes](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1) allowed for this application |
| description | string |  | Short description of what the application does |
| author | string |  | The name of the author of the client application |
| author_url | string |  | The URL to the page about the author |
| callback_url | string |  | The URL of the client application, that will handle OAuth redirects |
| logo | [File Upload](https://developer.kayako.com/api/v1/reference/file_upload) |  | Image larger than `100x100` will be scaled down |
| logo_file_id | integer |  | The ID of the image file, see [Two-step upload](https://developer.kayako.com/api/v1/reference/file_upload/#two-step-upload-1) |

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "name": "Brewfictus mobile app",
        "url": "https://brewfictus.com/apps/kayako",
        "key": "c054173c-89d2-48c2-b020-1ce3f7874462",
        "secret": null,
        "scopes": [],
        "logo": {
            "url": "https://brewfictus.kayako.com/api/v1/oauth/clients/1/logo",
            "created_at": "2016-12-29T16:07:04+00:00"
        },
        "description": "Support client for mobile devices",
        "author": "Brewfictus",
        "author_url": "https://brewfictus.com",
        "callback_url": "https://brewfictus.com/oauth/callback",
        "creator": {
            "id": 1,
            "resource_type": "user"
        },
        "last_used_at": null,
        "created_at": "2016-12-29T16:06:27+00:00",
        "updated_at": null,
        "resource_type": "oauth_client",
        "resource_url": "https://brewfictus.kayako.com/api/v1/oauth/clients/1"
    },
    "resource": "oauth_client"
}
```

## Delete a client

DELETE**/api/v1/oauth/clients/:id.json**

### Information

Allowed for Admins & Owners

### Response

```
{
    "status": 200
}
```

## Delete clients

DELETE**/api/v1/oauth/clients.json**

### Information

Allowed for Admins & Owners

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```

## User grants

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| user | [User](https://developer.kayako.com/api/v1/users/users/) |  |  |
| client | [Client](https://developer.kayako.com/api/v1/general/oauth/#Clients) |  |  |
| scopes | array |  | [API scopes](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1) |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| last_activity_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format. The timestamp is not accurate. |
| expiry_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve user grants

GET**/api/v1/oauth/grants.json**

### Information

Allowed for Admins & Owners

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| user_id | integer |  | Filter grants by user ID |
| client_id | integer |  | Filter grants by client ID |

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "user": {
                "id": 1,
                "resource_type": "user"
            },
            "client": {
                "id": 1,
                "resource_type": "oauth_client"
            },
            "scopes": [
                "conversations:write",
                "configuration:read"
            ],
            "created_at": "2016-12-16T12:26:43+00:00",
            "last_activity_at": "2017-06-07T18:50:47+00:00",
            "expiry_at": null,
            "resource_type": "oauth_grant",
            "resource_url": "https://brewfictus.kayako.com/api/v1/oauth/grants/1"
        }
    ],
    "resource": "oauth_grant",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Retrieve a user grant

GET**/api/v1/oauth/grants/:id.json**

### Information

Allowed for Admins & Owners

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "user": {
            "id": 1,
            "resource_type": "user"
        },
        "client": {
            "id": 1,
            "resource_type": "oauth_client"
        },
        "scopes": [
            "conversations:write",
            "configuration:read"
        ],
        "created_at": "2016-12-16T12:26:43+00:00",
        "last_activity_at": "2017-06-07T18:50:47+00:00",
        "expiry_at": null,
        "resource_type": "oauth_grant",
        "resource_url": "https://brewfictus.kayako.com/api/v1/oauth/grants/1"
    },
    "resource": "oauth_grant"
}
```

## Delete a user grant

DELETE**/api/v1/oauth/grants/:id.json**

### Information

Allowed for Admins & Owners

### Response

```
{
    "status": 200
}
```

## Delete user grants

DELETE**/api/v1/oauth/grants.json**

### Information

Allowed for Admins & Owners

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```

## Own grants

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| client | [Client](https://developer.kayako.com/api/v1/general/oauth/#client) |  |  |
| scopes | array |  | [API scopes](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1) |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| last_activity_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format. The timestamp is not accurate. |
| expiry_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Client

### RESOURCE FIELDS

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  | The title of the client application |
| url | string |  | The URL to the page about the client application |
| logo | [Logo](https://developer.kayako.com/api/v1/general/oauth/#logo) |  |  |
| description | string |  | Short description of what the application does |
| author | string |  | The name of the author of the client application |
| author_url | string |  | The URL to the page about the author |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve all own grants

GET**/api/v1/oauth/my_grants.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "client": {
                "name": "Brewfictus mobile app",
                "url": "https://brewfictus.com/apps/kayako",
                "logo": {
                    "url": "https://brewfictus.kayako.com/api/v1/oauth/clients/1/logo",
                    "created_at": "2016-12-29T16:07:04+00:00"
                },
                "description": "Support client for mobile devices",
                "author": "Brewfictus",
                "author_url": "https://brewfictus.com",
                "created_at": "2016-12-29T16:06:27+00:00",
                "updated_at": null
            },
            "scopes": [
                "conversations:write",
                "configuration:read"
            ],
            "created_at": "2016-12-22T15:30:55+00:00",
            "last_activity_at": "2017-06-07T18:51:15+00:00",
            "expiry_at": null,
            "resource_type": "my_oauth_grant",
            "resource_url": "https://brewfictus.kayako.com/api/v1/oauth/my_grants/1"
        }
    ],
    "resource": "my_oauth_grant",
    "offset": 0,
    "limit": 10,
    "total_count": 1
}
```

## Retrieve an own grant

GET**/api/v1/oauth/my_grants/:id.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "client": {
            "name": "Brewfictus mobile app",
            "url": "https://brewfictus.com/apps/kayako",
            "logo": {
                "url": "https://brewfictus.kayako.com/api/v1/oauth/clients/1/logo",
                "created_at": "2016-12-29T16:07:04+00:00"
            },
            "description": "Support client for mobile devices",
            "author": "Brewfictus",
            "author_url": "https://brewfictus.com",
            "created_at": "2016-12-29T16:06:27+00:00",
            "updated_at": null
        },
        "scopes": [
            "conversations:write",
            "configuration:read"
        ],
        "created_at": "2016-12-22T15:30:55+00:00",
        "last_activity_at": "2017-06-07T18:51:15+00:00",
        "expiry_at": null,
        "resource_type": "my_oauth_grant",
        "resource_url": "https://brewfictus.kayako.com/api/v1/oauth/my_grants/1"
    },
    "resource": "my_oauth_grant"
}
```

## Delete an own grant

DELETE**/api/v1/oauth/my_grants/:id.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners

### Response

```
{
    "status": 200
}
```

## Delete own grants

DELETE**/api/v1/oauth/my_grants.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | string |  | The comma separated ids |

### Response

```
{
    "status": 200,
    "total_count": 2
}
```




### Sessions

Title: Sessions - General | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/general/sessions/

Published Time: Thu, 15 Feb 2018 07:35:46 GMT

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   OTHER
4.   GENERAL

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| portal | string |  |  |
| ip_address | string |  |  |
| user_agent | string |  |  |
| instance_id | string |  |  |
| instance_name | string |  |  |
| user | [User](https://developer.kayako.com/api/v1/users/users/) |  |  |
| status | string |  | `ONLINE`, `OFFLINE`, `AWAY`, `BACK`, `BUSY`, `AUTOAWAY`, `INVISIBLE` |
| last_activity_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| created_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Retrieve session

GET**/api/v1/session.json**

### Information

Allowed for Public

### Request Parameters

*   `remember_me` - `true`/`false`(default). If sent `true`, _Remember Me Token_ is returned as the value of `X-RememberMe` header.

```
X-RememberMe: PxAjGDZERVVCxi88CrqTJpDD7S6vbu9lr2OneIS+xbK/wB/NrJcp+CJzfxQQj9aV3QTvtmtt+2r6vkSrdetoUc7glF5G/agcnw8o3dZxyB8=
```

### Response Body

```
{
    "status": 200,
    "data": {
        "id": "9GrwKuIMvHdjmf369ed75a56fd7a8d4606026cd7a34d4e99c487a3NjrBdRw4npE3qYlczSrV0DA6",
        "portal": "API",
        "ip_address": "10.0.2.2",
        "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.125 Safari/537.36",
        "instance_id": "153479",
        "instance_name": "brewfictus.kayako.com",
        "user": {
            "id": 1,
            "resource_type": "user"
        },
        "status": "ONLINE",
        "last_activity_at": "2015-08-03T06:41:22+05:00",
        "created_at": "2015-08-03T06:41:03+05:00",
        "resource_type": "session"
    },
    "resource": "session"
}
```

## Update session activity

PUT**/api/v1/session/ack.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

### Response

```
{
    "status": 200
}
```

## Delete a session

DELETE**/api/v1/session.json**

### Information

Allowed for Customers, Collaborators, Agents, Admins & Owners

### Response

```
{
    "status": 200
}
```




### Settings

Title: Settings - General | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/general/settings/

Published Time: Thu, 15 Feb 2018 07:35:46 GMT

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   OTHER
4.   GENERAL

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| category | string |  |  |
| name | string |  |  |
| is_protected | boolean |  |  |
| value | string |  |  |

## Retrieve all settings

GET**/api/v1/settings.json**

### Information

Allowed for Collaborators, Agents, Admins & Owners
Scope[configuration](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| category | string |  | a name of the category |

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "category": "account",
            "name": "default_language",
            "is_protected": false,
            "value": "en-us",
            "resource_type": "setting"
        },
        {
            "id": 2,
            "category": "account",
            "name": "timezone",
            "is_protected": false,
            "value": "UTC",
            "resource_type": "setting"
        },
        {
            "id": 3,
            "category": "account",
            "name": "time_format",
            "is_protected": false,
            "value": "24hour",
            "resource_type": "setting"
        }
    ],
    "resource": "setting",
    "total_count": 3
}
```

## Update settings

PUT**/api/v1/settings.json**

### Information

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| values | array |  | It accepts a key-value pair to update settings value. Supports multiple updates. **Example**: ['general.companyname' => 'Brewfictus', 'general.enablesmtp => 1] |

### Request

```
curl -X PUT -k https://brewfictus.kayako.com/api/v1/settings \
-d '{"values":{"general.companyname":"Brewfictus","general.enablesmtp":1}}' \
-H "Content-Type: application/json" \
-u 'jordan.mitchell@brewfictus.com:jmit6#lsXo'
```

### Response

```
{
    "status": 200,
    "total_count": 1
}
```




### Tests

Title: Tests - General | Kayako Developers

URL Source: https://developer.kayako.com/api/v1/general/tests/

Published Time: Thu, 15 Feb 2018 07:35:46 GMT

Markdown Content:
1.   [API](https://developer.kayako.com/api/)
2.   v1
3.   OTHER
4.   GENERAL

| Name | Type | Read-only | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| array_items | array |  | Array of integers |
| is_boolean | boolean |  |  |
| float_number | float |  |  |
| integer_number | integer |  |  |
| option | string |  | `FOO`, `BAR`, `ANY` or `NONE` |
| binary_data | binary |  |  |
| user | [User](https://developer.kayako.com/api/v1/users/users/) |  | The user that made this request. Will be `null` if the request is unauthenticated |
| updated_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) |

## Retrieve all tests

GET**/api/v1/tests.json**

### Information

Allowed for Public

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| count | integer |  | Number of test resources to generate **Default:**`1` |

### Response

```
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "name": "Test 1",
            "user": {
                "id": 1,
                "resource_type": "user"
            },
            "array_items": [
                1,
                2,
                3
            ],
            "is_boolean": true,
            "float_number": 1.23,
            "integer_number": 123,
            "option": "FOO",
            "binary_data": "4pi6",
            "updated_at": "2016-08-18T15:17:39+00:00",
            "resource_type": "test",
            "resource_url": "https://brewfictus.kayako.com/api/v1/tests/1"
        }
    ],
    "resource": "test",
    "limit": 10,
    "total_count": 1
}
```

## Retrieve a test

GET**/api/v1/tests/:id.json**

### Information

Allowed for Public

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| non_existent | boolean |  | If specified as `true` the API will respond with a `404`, signalling that the resource doesn't exist. Default: `false` |

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "name": "Test 1",
        "user": {
            "id": 1,
            "resource_type": "user"
        },
        "array_items": [
            1,
            2,
            3
        ],
        "is_boolean": true,
        "float_number": 1.23,
        "integer_number": 123,
        "option": "FOO",
        "binary_data": "4pi6",
        "updated_at": "2016-08-18T15:17:39+00:00",
        "resource_type": "test",
        "resource_url": "https://brewfictus.kayako.com/api/v1/tests/1"
    },
    "resource": "test"
}
```

## Add a test

POST**/api/v1/tests.json**

### Information

Allowed for Public

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| array_items | array |  | Array of integers |
| is_boolean | boolean |  |  |
| float_number | float |  |  |
| integer_number | integer |  |  |
| option | string |  | `FOO`, `BAR`, `ANY` or `NONE` |
| binary_data | binary |  |  |

### Response

```
{
    "status": 201,
    "data": {
        "id": 1,
        "name": "Test 1",
        "user": {
            "id": 1,
            "resource_type": "user"
        },
        "array_items": [
            1,
            2,
            3
        ],
        "is_boolean": true,
        "float_number": 1.23,
        "integer_number": 123,
        "option": "FOO",
        "binary_data": "4pi6",
        "updated_at": "2016-08-18T15:17:39+00:00",
        "resource_type": "test",
        "resource_url": "https://brewfictus.kayako.com/api/v1/tests/1"
    },
    "resource": "test"
}
```

## Update a test

PUT**/api/v1/tests/:id.json**

### Information

Allowed for Public

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| non_existent | boolean |  | If specified as `true` the API will respond with a `404`, signalling that the resource doesn't exist. Default: `false` |

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| name | string |  |  |
| array_items | array |  | Array of integers |
| is_boolean | boolean |  |  |
| float_number | float |  |  |
| integer_number | integer |  |  |
| option | string |  | `FOO`, `BAR`, `ANY` or `NONE` |
| binary_data | binary |  |  |

### Response

```
{
    "status": 200,
    "data": {
        "id": 1,
        "name": "Test 1",
        "user": {
            "id": 1,
            "resource_type": "user"
        },
        "array_items": [
            1,
            2,
            3
        ],
        "is_boolean": true,
        "float_number": 1.23,
        "integer_number": 123,
        "option": "FOO",
        "binary_data": "4pi6",
        "updated_at": "2016-08-18T15:17:39+00:00",
        "resource_type": "test",
        "resource_url": "https://brewfictus.kayako.com/api/v1/tests/1"
    },
    "resource": "test"
}
```

## Update tests

PUT**/api/v1/tests.json**

### Information

Allowed for Public

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | array |  | IDs |

### Parameters

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| array_items | array |  | Array of integers |
| is_boolean | boolean |  |  |
| float_number | float |  |  |
| integer_number | integer |  |  |
| option | string |  | `FOO`, `BAR`, `ANY` or `NONE` |
| binary_data | binary |  |  |

### Response

```
{
    "status": 200,
    "total_count": 5
}
```

## Delete a test

DELETE**/api/v1/tests/:id.json**

### Information

Allowed for Public

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| non_existent | boolean |  | If specified as `true` the API will respond with a `404`, signalling that the resource doesn't exist. Default: `false` |

### Response

```
{
    "status": 200
}
```

## Delete tests

DELETE**/api/v1/tests.json**

### Information

Allowed for Public

### Arguments

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| ids | array |  | List of IDs to be deleted |

### Response

```
{
    "status": 200,
    "total_count": 3
}
```



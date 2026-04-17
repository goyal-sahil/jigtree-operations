# 

[**Introduction	4**](#introduction)

[**Implementing SSO	5**](#implementing-sso)

[Logging in	5](#logging-in)

[Generating JWT token	6](#generating-jwt-token)

[Header	6](#header)

[Example	6](#example)

[Payload	7](#payload)

[Example	8](#example-1)

[Signature	9](#signature)

[Redirecting to Kayako	9](#redirecting-to-kayako)

[Handling errors	10](#handling-errors)

[**PHP	13**](#php)

[Requirements	13](#requirements)

[Checking for SSO request	13](#checking-for-sso-request)

[Generating JWT token	13](#generating-jwt-token-1)

[Redirecting back to Kayako	15](#redirecting-back-to-kayako)

[**Using API	16**](#using-api)

[JWT authentication	16](#jwt-authentication)

[Payload	17](#payload-1)

[**Introduction	18**](#introduction-1)

[Available API Endpoints	18](#available-api-endpoints)

[Core	18](#core)

[Channels	19](#channels)

[Other	19](#other)

[Request	19](#request)

[Response	21](#response)

[Authentication	23](#authentication)

[Testing	24](#testing)

[GET	25](#get)

[POST	25](#post)

[PUT	26](#put)

[DELETE	27](#delete)

[**Authentication	29**](#authentication-1)

[Schemes	29](#schemes)

[Basic HTTP Authentication	29](#basic-http-authentication)

[OTP authentication step	32](#otp-authentication-step)

[Password update step	34](#password-update-step)

[OAuth 2.0	36](#oauth-2.0)

[API scopes	38](#api-scopes)

[Fingerprint authentication	40](#fingerprint-authentication)

[Remember Me Token Authentication	41](#remember-me-token-authentication)

[Session	41](#session)

[**Request	44**](#request-1)

[Headers	45](#headers)

[Accept	45](#accept)

[Content-Length	46](#content-length)

[Content-Type	46](#content-type)

[Arguments and parameters	47](#arguments-and-parameters)

[Body format	47](#body-format)

[URL-encoded	48](#url-encoded)

[CURL	49](#curl)

[JSON	49](#json)

[CURL	51](#curl-1)

[Multi-part	52](#multi-part)

[CURL	54](#curl-2)

[File upload	55](#file-upload)

[**Response	56**](#response-1)

[Status code	57](#status-code)

[Headers	60](#headers-1)

[Body	60](#body)

[Main fields	60](#main-fields)

[Errors, notifications and logs	61](#errors,-notifications-and-logs)

[Errors	62](#errors)

[Notifications	63](#notifications)

[Logs	66](#logs)

[**Response	68**](#response-2)

[Status code	69](#status-code-1)

[Headers	72](#headers-2)

[Body	72](#body-1)

[Main fields	72](#main-fields-1)

[Errors, notifications and logs	73](#errors,-notifications-and-logs-1)

[Errors	74](#errors-1)

[Notifications	75](#notifications-1)

[Logs	78](#logs-1)

[**Partial Output	80**](#partial-output)

[By resource types	80](#by-resource-types)

[The include argument	80](#the-include-argument)

[By resource fields	81](#by-resource-fields)

[Field categories	82](#field-categories)

[The fields argument	82](#the-fields-argument)

[Modifiers	82](#modifiers)

[Nested fields	83](#nested-fields)

[Default display	84](#default-display)

[Wildcard for all fields	84](#wildcard-for-all-fields)

[**Pagination	86**](#pagination)

[Offset-based	86](#offset-based)

[Cursor-based	87](#cursor-based)

[Date-based	90](#date-based)

[**File Upload	94**](#file-upload-1)

[Two-step upload	94](#two-step-upload)

[Upload to File resource	95](#upload-to-file-resource)

[Associate file with resource	96](#associate-file-with-resource)

[Single-step upload	96](#single-step-upload)

[Upload file content as request body	96](#upload-file-content-as-request-body)

[File name	97](#file-name)

[Field name	98](#field-name)

[File size	98](#file-size)

[Checksum	99](#checksum)

[Complete example	100](#complete-example)

[CURL	101](#curl-3)

[Using multi-part form data	102](#using-multi-part-form-data)

[Complete example	104](#complete-example-1)

[CURL	105](#curl-4)

[**Caching	107**](#caching)

[ETag response header	107](#etag-response-header)

[If-Match request header	108](#if-match-request-header)

[If-None-Match request header	109](#if-none-match-request-header)

[Last-Modified response header	110](#last-modified-response-header)

[If-Modified-Since request header	111](#if-modified-since-request-header)

[If-Unmodified-Since request header	112](#if-unmodified-since-request-header)

[AJAX Caching Mode	112](#ajax-caching-mode)

[**Security	114**](#security)

[CSRF protection	114](#csrf-protection)

[Use protected sessions	114](#use-protected-sessions)

[Protect API requests	115](#protect-api-requests)

[Disable CSRF protection	116](#disable-csrf-protection)

[JavaScript	116](#javascript)

[**Rate Limiting	118**](#rate-limiting)

[**Special Options	120**](#special-options)

[Letter case	120](#letter-case)

[Empty fields	121](#empty-fields)

[Flat mode	122](#flat-mode)

[**Special Options	131**](#special-options-1)

[Letter case	131](#letter-case-1)

[Empty fields	132](#empty-fields-1)

[Flat mode	133](#flat-mode-1)

[**Using Javascript	142**](#using-javascript)

[CORS (Cross-Origin Resource Sharing)	142](#cors-\(cross-origin-resource-sharing\))

[JSONP (JSON with Padding)	143](#jsonp-\(json-with-padding\))

# 

# Authentication

url \= "https://central-supportdesk.kayako.com/api/v1/conversations.json"

    email \= ""

    password \= ""

    

    \# Required headers for Kayako API

    headers \= {

        "Accept": "application/json",

        "Content-Type": "application/json",

        "Authorization": f"Basic {base64.b64encode(f'{email}:{password}'.encode()).decode()}"

    }

# Introduction {#introduction}

Single sign-on (SSO) is a technique, that allows users to authenticate to a third-party service (Kayako in this case) with another service (the SSO service). This means, that a user can authenticate to the SSO service using, e.g., username and password, and then this service can generate a special token and use it to automatically authenticate the user to a third-party service. In this way, the user shares username and password only with one of the services and other ones authenticate the user using the trusted token, that was generated by this service.

Using single sign-on you can have users of your primary web portal automatically authenticated in your Kayako helpdesk. In this way, you can also embed components of your Kayako system, e.g., chat, into your primary web application.

To implement SSO Kayako uses [JSON Web Token (JWT)](https://jwt.io/). It's an open standard, that describes a way of transmitting information between parties in a compact and secure JSON-based format. To make sure, that the sender can be trusted, JWT uses a digital signature. As the JWT token is small, it can be specified as a URL argument or in an HTTP header.

For details about JWT check [RFC 7519](https://tools.ietf.org/html/rfc7519).

# Implementing SSO {#implementing-sso}

Contents

* [1 Logging in](https://developer.kayako.com/docs/single_sign_on/implementation/#logging-in-1)  
* [2 Generating JWT token](https://developer.kayako.com/docs/single_sign_on/implementation/#generating-jwt-token-2)  
  * [2.1 Header](https://developer.kayako.com/docs/single_sign_on/implementation/#header-2.1)  
    * [2.1.1 Example](https://developer.kayako.com/docs/single_sign_on/implementation/#example-2.1.1)  
  * [2.2 Payload](https://developer.kayako.com/docs/single_sign_on/implementation/#payload-2.2)  
    * [2.2.1 Example](https://developer.kayako.com/docs/single_sign_on/implementation/#example-2.2.1)  
  * [2.3 Signature](https://developer.kayako.com/docs/single_sign_on/implementation/#signature-2.3)  
* [3 Redirecting to Kayako](https://developer.kayako.com/docs/single_sign_on/implementation/#redirecting-to-kayako-3)  
* [4 Handling errors](https://developer.kayako.com/docs/single_sign_on/implementation/#handling-errors-4)

## Logging in {#logging-in}

After SSO is enabled, as described in [Configuring SSO](https://developer.kayako.com/docs/single_sign_on/configuration/), when users access a page, that requires authentication, they are redirected to the Remote login URL, that has been specified in the configuration. The additional argument returnto, that will be added to this redirect URL, will hold the URL of the Kayako SSO end point.

Thus, if the Remote login URL is https://redmine.brewfictus.com/login, the redirect URL will be, e.g.:

```

https://redmine.brewfictus.com/login?returnto=https%3A%2F%2Fbrewfictus.kayako.com%2Fagent%2FBase%2FSSO%2FJWT%2F%26type%3Dagent%26action%3D%2Fagent%2F

```

After the remote login page successfully authenticates the user, it will need to generate a valid JWT token and redirect back to the return URL, that has been passed in the returnto argument.

See also [Redirecting to Kayako](https://developer.kayako.com/docs/single_sign_on/implementation/#redirecting-to-kayako-3) below.

## Generating JWT token {#generating-jwt-token}

The JWT token should consist of three parts separated by dots (.). Each of these parts should be [base64-encoded](https://en.wikipedia.org/wiki/Base64).

First two parts of the JWT token are JSON objects.

For more details check [RFC 7519](https://tools.ietf.org/html/rfc7519).

### **Header** {#header}

The header JSON object delivers properties of the JWT token:

| Claim | Mandatory | Description |
| :---- | :---: | :---- |
| typ |  | **Type**: always JWT |
| alg |  | **Algorithm**: HS256, HS384 or HS512 |

#### Example {#example}

```

{
    "typ": "JWT",
    "alg": "HS256"
}
```

### **Payload** {#payload}

The payload JSON object, which should be in the middle, delivers user data:

| Claim | Mandatory | Description |
| :---- | :---: | :---- |
| iat |  | **Issued At**: the time, at which the token was generated, in the number of seconds since the Unix epoch |
| jti |  | **JWT token ID**: the unique identifier of the token |
| email |  | The email address of the user |
| name |  | The full name of the user |
| role |  | Possible values: customer, agent, admin or owner **Default:** customer |
| external\_id |  | A unique identifier of the user in the SSO service |
| locale |  |  |
| organization |  |  |
| phone\_number |  | Must be unique to the user |
| tags |  | Comma-separated list of tags |
| picture |  | The URL to the avatar image of the user |

Kayako first attempts to identify the user by the external\_id claim, if it's specified, and then by the email claim. The external\_id claim is to be set to a unique ID of the user's account in the SSO service, but can be omitted.

If the user does not exist in Kayako, it will be created with all the specified attributes. If the user exists, values of the claims name, locale, phone\_number, tags and picture will update (replace) existing values in the user's profile.

The value of the organization claim is ignored for owners, admins and agents. For customers it is used, only when the user is created.

The role claim should always be specified, when the JWT token is used to [access API](https://developer.kayako.com/docs/single_sign_on/api/).

#### Example {#example-1}

```

{
    "iat": 1464285714,
    "jti": "1tEC3NRiaxPnRo0gB03YGGt5xUmUhLLm",
    "email": "jordan.mitchell@brewfictus.com",
    "name": "Jordan Mitchell",
    "role": "admin",
    "external_id": "1407638772888867",
    "locale": "en-us",
    "organization": "Brewfictus",
    "phone_number": "+14156792019",
    "tags": "Support, Manager",
    "picture": "https://brewfictus.kayako.com/avatar/get/63d1d45c-408a-55be-87ac-ad09470ea742"
}
```

### **Signature** {#signature}

The last part of the JWT token is digital signature of the two previous parts, which is calculated as follows:

```

hmac_sha(base64($header) + '.' + base64($payload), $shared_secret)

```

Here, $shared\_secret is the secret, which is specified in [SSO configuration](https://developer.kayako.com/docs/single_sign_on/configuration/).

The signature must use HMAC SHA256, SHA384 or SHA512 algorithm. The used algorithm must also be specified in the alg claim of the JWT header.

## Redirecting to Kayako {#redirecting-to-kayako}

Having generated the JWT token, the remote login page must deliver it to Kayako using the URL, that was passed in the returnto argument of the Remote login URL (see also [Logging in](https://developer.kayako.com/docs/single_sign_on/implementation/#logging-in-1) above). The token must be appended to this URL in the jwt argument, as in the following example:

```

https://brewfictus.kayako.com/agent/Base/SSO/JWT/?type=agent&action=/agent/&jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE0NjQyODU3MTQsImp0aSI6IjF0RUMzTlJpYXhQblJvMGdCMDNZR0d0NXhVbVVoTExtIiwiZW1haWwiOiJqb3JkYW4ubWl0Y2hlbGxAYnJld2ZpY3R1cy5jb20iLCJuYW1lIjoiSm9yZGFuIE1pdGNoZWxsIn0.HvwWzFF4eOzn4xKNw6sMGzKk6kl91FhgiG0SP2SHXZk

```

If the JWT token is valid, Kayako will let the user log in and then will redirect the browser to the page, which is specified in the action argument.

So, if you want to redirect the user to a custom page after successful login, you need to modify the value of the action argument. This argument holds the path of the page, e.g., /agent/cases/101.

In the case of an error, Kayako will redirect the user back to the Remote login URL. If you want to let the user try logging in without SSO instead, add the \&fallback=true to the return URL.

## Handling errors {#handling-errors}

If an error occurs while processing the JWT token, Kayako will redirect the user back to the Remote login URL, having added three additional arguments, that describe the error:

* message contains the description of the error  
* code is the numeric identifier of the error, usually 0  
* type is always error

```

lsXo'

```

For the help center security.agent needs to be replaced with security.customer.

See also [Settings API](https://developer.kayako.com/api/v1/general/settings/#Update-settings).

# PHP {#php}

## Requirements {#requirements}

To implement SSO between Kayako and your application in PHP you will need a PHP JWT implementation. We recommend to use [PHP-JWT](https://github.com/firebase/php-jwt).

## Checking for SSO request {#checking-for-sso-request}

In your controller's login code, just before you redirect the user back, check for the returnto argument as follows:

```

if (array_key_exists('returnto', $_REQUEST)) {
    ...
    header('Location: ' ...);
    exit;
}

```

The presence of the returnto argument indicates, that the login request was received from Kayako and you need to generate the JWT token and pass it back to the URL, that is specified in this argument.

## Generating JWT token {#generating-jwt-token-1}

The main part of the JWT token is called payload. To generate the payload you will need at least $user\_email and $user\_name, and $shared\_secret (which is shared with Kayako):

```

$payload = array(
    'iat'   => time(),
    'jti'   => md5($shared_secret . ':' . time()),
    'email' => $user_email,
    'name'  => $user_name
);

```

If the corresponding data are available for users in your application, it is recommended, that you also specify values for [other claims](https://developer.kayako.com/docs/single_sign_on/implementation/#payload-2.2).

When ready, use PHP-JWT to generate the token as follows:

```

use \Firebase\JWT\JWT;
...
$token = JWT::encode($payload, $shared_secret, 'HS256');

```

This code will generate the header and signature parts of the token and will format it accordingly.

## Redirecting back to Kayako {#redirecting-back-to-kayako}

When ready, the JWT token should be passed back to Kayako as a part of the returnto URL as follows:

```

header('Location: ' . $_REQUEST['returnto'] . '&jwt=' . $token);
```

# Using API {#using-api}

In Kayako JWT tokens, that are intended for single sign-on, can also be used to access the [API service](https://developer.kayako.com/api/v1/reference/introduction/). This can be useful, if, e.g., you want to embed some part of Kayako functionality into your web application, which is used as the SSO service.

This technique can be described as JWT authentication. To use this authentication scheme the API client must include the JWT token into its [API request](https://developer.kayako.com/api/v1/reference/request/).

JWT authentication for API requires JWT SSO to be enabled for the agent portal, if the authenticated user is an agent, and for the help center, if the authenticated user is a customer.

## JWT authentication {#jwt-authentication}

To authenticate you should supply the JWT token in the Authorization HTTP header with the Bearer schema as follows:

```

Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE0NjQyODU3MTQsImp0aSI6IjF0RUMzTlJpYXhQblJvMGdCMDNZR0d0NXhVbVVoTExtIiwiZW1haWwiOiJqb3JkYW4ubWl0Y2hlbGxAYnJld2ZpY3R1cy5jb20iLCJuYW1lIjoiSm9yZGFuIE1pdGNoZWxsIiwicm9sZSI6ImFkbWluIn0.0N9G862lfuLdyeom8_t9VqyF35UUFY78EBDUsy5oXgI

```

Alternatively, you can use the \_jwt argument.

## Payload {#payload-1}

By default, the API service assumes, that the role of the user, which is authenticated using JWT, is customer. If it's not true, the API service will return an error. Therefore, it is recommended, that the role claim is always included into the JWT payload, when it is used to access API.

See also [Payload](https://developer.kayako.com/docs/single_sign_on/implementation/#payload-2.2).

# Introduction {#introduction-1}

The Kayako API (the API) is our proprietary REST API implementation.

The API is based on resources. A resource is an object that the API end point fetches and/or manipulates. A collection (an array of resources) is a resource as well.

A resource **can** support the following basic REST API actions (that are actually HTTP methods):

* GET for retrieving the resource  
* POST for creating the resource  
* PUT for modifying the resource  
* DELETE for removing the resource

Read more about REST API [here](https://en.wikipedia.org/wiki/Representational_state_transfer).

Kayako API is "RESTless".

## Available API Endpoints {#available-api-endpoints}

### **Core** {#core}

* [Users](https://developer.kayako.com/api/v1/users/activities/)  
* [Cases](https://developer.kayako.com/api/v1/cases/activities/)  
* [Insights](https://developer.kayako.com/api/v1/insights/cases/)  
* [Search](https://developer.kayako.com/api/v1/search/search/)  
* [Automation](https://developer.kayako.com/api/v1/automation/endpoints/)

   

  ### **Channels** {#channels}

* [Mail](https://developer.kayako.com/api/v1/mail/mailboxes/)  
* [Twitter](https://developer.kayako.com/api/v1/twitter/accounts/)  
* [Help Center](https://developer.kayako.com/api/v1/help_center/articles/)  
* [Facebook](https://developer.kayako.com/api/v1/facebook/accounts/)  
* [Event](https://developer.kayako.com/api/v1/event/events/)

   

  ### **Other** {#other}

* [General](https://developer.kayako.com/api/v1/general/autocomplete/)

## Request {#request}

To perform an API action you need to make an API request.

Actions can support "arguments" \- variables that are specified in the [query string](https://en.wikipedia.org/wiki/Query_string) of the HTTP request (they should be added to the URI in the request line). There are "common" API arguments (like fields, see [Partial Output](https://developer.kayako.com/api/v1/reference/partial_output/)), which can be used for all API requests. Among these common arguments there are also special "server" arguments, that start with \_ (e.g., \_empty, see [Special Options](https://developer.kayako.com/api/v1/reference/special_options/)).

In addition to arguments the API intensively uses HTTP headers *(which are **preferred**, if argument-based alternatives exist)*. Thus, caching and concurrency control are implemented using If-Match, If-None-Match, If-Modified-Since and If-Unmodified-Since HTTP headers (see [Caching](https://developer.kayako.com/api/v1/reference/caching/)).

Main properties of resources are to be sent using "parameters" \- variables that are delivered in the request body *(which is used only for POST and PUT actions)*. The request body is usually formatted accordingly to the application/x-www-form-urlencoded content type (see [Request](https://developer.kayako.com/api/v1/reference/request/)).

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

```

curl -X POST \
     -d name=Test \
     -d array_items=1,2,3 \
     -d is_boolean=true 'https://brewfictus.kayako.com/api/v1/tests&_empty=false'

```

See also [Request](https://developer.kayako.com/api/v1/reference/request/).

## Response {#response}

An API request, that has been sent to the API service, returns an API response.

The HTTP status code of the API response is the first thing to check for errors (except JSONP, see [Using JavaScript](https://developer.kayako.com/api/v1/reference/using_javascript/)).

API responses come with the response body (except cached responses, see [Caching](https://developer.kayako.com/api/v1/reference/caching/)), that delivers the special response JSON message. The response message contains the resource (if any) under the special data field. In addition, the message contains the status field, that delivers the HTTP status code, and **can** contain errors, notifications, logs and more (see [Response](https://developer.kayako.com/api/v1/reference/response/)).

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
    "
data": {
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

## Authentication {#authentication}

The vast majority of API end points require the user to be authenticated.

The easiest way to authenticate is to use the standard Basic HTTP authentication scheme (there is also a more flexible OAuth 2.0 scheme, see [Authentication](https://developer.kayako.com/api/v1/reference/authentication/)). The Basic HTTP scheme expects the username and password to be base64-encoded and added to the Authorization HTTP header as follows (check also [this page](https://en.wikipedia.org/wiki/Basic_access_authentication)):

```

Authorization: Basic base64($username:$password)

```

This authentication scheme is also supported by CURL:

```

curl -u norton.low@eyecloud.com:B2WwHWTJzI49NM \
     'https://brewfictus.kayako.com/api/v1/tests&fields=*'

```

See also [Authentication](https://developer.kayako.com/api/v1/reference/authentication/).

## Testing {#testing}

To test the Kayako API you can use the special public [Test](https://developer.kayako.com/api/v1/general/tests/) resource.

For example:

### **GET** {#get}

To retrieve multiple test resources:

```

curl 'https://brewfictus.kayako.com/api/v1/tests?_empty=false&count=45'

```

To retrieve the test resource with ID \= 1:

```

curl https://brewfictus.kayako.com/api/v1/tests/1

```

### **POST** {#post}

To create a test resource:

```

curl -X POST \
     -d 'name=Caryn Pryor' \
     -d array_items=1,2,3 \
     -d is_boolean=true \
     -d option=BAR \
     -d binary_data=Q2FyeW4gUHJ5b3I= https://brewfictus.kayako.com/api/v1/tests

```

### **PUT** {#put}

To update the test resource with ID \= 1:

```

curl -X PUT \
     -d is_boolean=false \
     -d option=NONE https://brewfictus.kayako.com/api/v1/tests/1

```

To update multiple test resources at once:

```

curl -X PUT \
     -d option=ANY 'https://brewfictus.kayako.com/api/v1/tests?ids=1,2,3'

```

### **DELETE** {#delete}

To remove the test resource with ID \= 999:

```

curl -X DELETE https://brewfictus.kayako.com/api/v1/tests/999

```

To remove multiple test resources at once:

```

curl -X DELETE 'https://brewfictus.kayako.com/api/v1/tests?ids=997,998,999'

```

# Authentication {#authentication-1}

Contents

* [1 Schemes](https://developer.kayako.com/api/v1/reference/authentication/#schemes-1)  
  * [1.1 Basic HTTP Authentication](https://developer.kayako.com/api/v1/reference/authentication/#basic-http-authentication-1.1)  
    * [1.1.1 OTP authentication step](https://developer.kayako.com/api/v1/reference/authentication/#otp-authentication-step-1.1.1)  
    * [1.1.2 Password update step](https://developer.kayako.com/api/v1/reference/authentication/#password-update-step-1.1.2)  
  * [1.2 OAuth 2.0](https://developer.kayako.com/api/v1/reference/authentication/#oauth-2-0-1.2)  
    * [1.2.1 API scopes](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1)  
  * [1.3 Fingerprint authentication](https://developer.kayako.com/api/v1/reference/authentication/#fingerprint-authentication-1.3)  
  * [1.4 Remember Me Token Authentication](https://developer.kayako.com/api/v1/reference/authentication/#remember-me-token-authentication-1.4)  
* [2 Session](https://developer.kayako.com/api/v1/reference/authentication/#session-2)

## Schemes {#schemes}

The Kayako API supports the following authentication schemes:

### **Basic HTTP Authentication** {#basic-http-authentication}

The Basic HTTP authentication is an authentication standard for the HTTP protocol (while it's considered to be insecure).

To authenticate using the Basic HTTP authentication protocol you need to use the Authorization HTTP header as follows:

```

Authorization: Basic base64($email:$password)

```

Important: While we always use the HTTPS protocol for transferring data to the server, the Basic HTTP authentication should still be avoided, when possible, as it operates the user password directly.

On successful Basic HTTP authentication you should receive an API response with an additional session\_id field:

```

{
    "status": 200,
    "session_id": "1P8xuJ4UQIWrRin2HU35V390e1d28ad230d0957c783bed37a4abe1bf6adbbB5Bw0Ja5PWO0v26lEa6z"
}
```

Use this session ID to authenticate in all subsequent API requests. See [Session](https://developer.kayako.com/api/v1/reference/authentication/#session-2) how.

Do **not** supply the Basic HTTP authentication header in subsequent API requests (after you have received the session ID).

---

In some conditions (depends on system and user configuration) a valid Basic HTTP authentication request can return an "error". If you get it, this means, that you need to go through some additional authentication step(s) to complete the authentication process (and get the session ID).

Such "error" response always comes with an additional auth\_token field, the value of which you'll need to complete the authentication:

```

"auth_token": "qhrejryxGtnLQe40nNetYPLp5H9sCMnG82ULd7jANTcI8hW61bDoTUGdp64u"

```

During the very next authentication step this token should be put into the X-Token HTTP header:

```

X-Token: qhrejryxGtnLQe40nNetYPLp5H9sCMnG82ULd7jANTcI8hW61bDoTUGdp64u

```

Or into the \_token argument.

Each authentication step has its own authentication token, that **cannot** be used for other steps (i.e. you can't use for password update the token, that was generated for OTP).

Only the Basic HTTP authentication scheme has these additional steps.

#### OTP authentication step {#otp-authentication-step}

The Basic HTTP authentication can "halt", if the two-factor authentication is enabled for the user.

The two-factor authentication can be enabled for a user in the Kayako administration area.

In this case the following response is returned by the API service:

```

{
    "status": 403,
    "
errors": [
        {
            "code": "OTP_EXPECTED",
            "message": "To complete authentication you need to provide the one-time password",
            "more_info": "https://developer.kayako.com/api/v1/reference/errors/OTP_EXPECTED"
        }
    ],
    "
notifications": [
        {
            "type": "INFO",
            "message": "Two-factor authentication is enabled for your account"
        }
    ],
    "auth_token": "dPQBJfPG5cGYd6MMPtowGz93x3uSN7Vc7yBw3JrKL5owqfowKFda4mezGefo5QDmRnxyV2"
}
```

If this is the case, ask the user for OTP (one-time password) and pass it in the X-OTP HTTP header:

```

X-Token: dPQBJfPG5cGYd6MMPtowGz93x3uSN7Vc7yBw3JrKL5owqfowKFda4mezGefo5QDmRnxyV2
X-OTP: 379069

```

Alternatively, you can pass it in the \_otp argument.

Users should use the [Google Authenticator](https://en.wikipedia.org/wiki/Google_Authenticator) to get the OTP.

If the OTP is correct, the user will get authenticated (and the session ID will be returned) or another authentication step will be requested by the API service.

#### Password update step {#password-update-step}

The Basic HTTP authentication can also "halt", if the user's password has expired.

The password expiration policy can be configured using the Kayako UI.

If this happens, the following response is returned by the API service:

```

{
    "status": 403,
    "
errors": [
        {
            "code": "CREDENTIAL_EXPIRED",
            "message": "The credential (e.g. password) is valid but has expired",
            "more_info": "https://developer.kayako.com/api/v1/reference/errors/CREDENTIAL_EXPIRED"
        }
    ],
    "auth_token": "eGDPtbMcQCXBLwef58Kz4HBCuaRPyq5QCMqFLD1iUUIGxUq48bADFUv2gRdxRJXhmduY0t37BAXeaaT1"
}
```

This means, that to complete the authentication you must update the user's password.

This can be done using the [Change password](https://developer.kayako.com/api/v1/users/profile/#Change-password) end point. The difference with the normal password update procedure is that you provide the authentication token (instead of being authenticated) and do not need to pass the old password:

```

PUT /api/v1/profile/password.json HTTP/1.1
Host: brewfictus.kayako.com
X-Token: eGDPtbMcQCXBLwef58Kz4HBCuaRPyq5QCMqFLD1iUUIGxUq48bADFUv2gRdxRJXhmduY0t37BAXeaaT1

new_password=xgw4sUBXQKaQT3pg

```

### **OAuth 2.0** {#oauth-2.0}

OAuth 2.0 is the de facto standard for API authentication nowadays.

Generally, OAuth 2.0 authentication is based on the access token. This token is like a password generated specially to be used by a particular API client.

To authenticate you should supply the OAuth 2.0 access token in the Authorization HTTP header as follows:

```

Authorization: Bearer 4b1442a6-38d1-ae34-9d55-adf5b41d6417

```

Alternatively, you can use the access\_token query argument.

Usually, OAuth 2.0 client libraries add the access token header or argument automatically, so you do not need to care about these details. Most such libraries (if you use them, what is **recommended**) can also retrieve or refresh access tokens transparently.

---

An access token can be retrieved with a special OAuth 2.0 request sent to the following end points:

**Authorization**

/oauth/token/authorize

**Token**

/oauth/token

The following grant types are currently supported by Kayako:

**Authorization Code**

The most commonly used and **recommended** grant type.

**User Credentials**

The grant type, that involves username and password.

**Refresh token**

The grant type, that is to be used to refresh the access token on a regular basis.

See also the [OAuth 2.0 documentation](http://oauth.net/2/) for more details.

#### API scopes {#api-scopes}

API scopes let restricting access of the API client to specific parts of the API service's functionality.

If the API end point is associated with the scope, which is not allowed for the API client, or if no scope is associated with it, the access to such end point for the API client will be rejected.

*To make sure, that the user agrees to grant access to corresponding functionality for a third-party app, the service lists requested scopes, when asking the user to authorize the app.*

Currently, Kayako supports the following scopes:

**users**

Access to [users](https://developer.kayako.com/api/v1/users/users/) (including [identities](https://developer.kayako.com/api/v1/users/identities/)), [organizations](https://developer.kayako.com/api/v1/users/organizations/) and [teams](https://developer.kayako.com/api/v1/users/teams/)

**conversations**

Access to [cases](https://developer.kayako.com/api/v1/cases/cases/) (including [views](https://developer.kayako.com/api/v1/cases/views/))

**insights**

Access to [insights](https://developer.kayako.com/api/v1/insights/cases/)

**search**

Access to [unified search](https://developer.kayako.com/api/v1/search/search/) (indirect access to users, cases and so on)

**configuration**

Configuration of the Kayako instance (including [SLAs](https://developer.kayako.com/api/v1/cases/service_level_agreements/), [automations](https://developer.kayako.com/api/v1/automation/endpoints/), [brands](https://developer.kayako.com/api/v1/general/brands/), custom fields and more)

Each of the scopes can be specified (in token retrieval request by the API client) with the optional access level (separated from the scope by colon :):

**read**

Read-only access to data

**write**

Full access to data

If the access level is not specified, :write is assumed.

### **Fingerprint authentication** {#fingerprint-authentication}

For certain endpoints, the Kayako API allows access without requiring user credentials or a [Session ID](https://developer.kayako.com/api/v1/reference/authentication/#session-2).

Such access is very limited, and should only be used when a valid session cannot be established (applications targeted primarily towards unregistered users). One such use case is [Kayako Messenger](https://www.kayako.com/glossary/messenger), which is embeddable on other websites.

Fingerprint IDs are secret tokens (UUIDs) that are generated by the client and supplied via the X-Fingerprint-ID header. For cases where supplying a header is not possible, the query parameter \_fingerprint\_id can be used instead.

A client using fingerprint authentication can only view resources that were created with that very fingerprint ID.

### **Remember Me Token Authentication** {#remember-me-token-authentication}

To authenticate using *Remember Me Token* (stored on the client side), 2 headers are required X-RememberMe and X-Fingerprint.

* X-RememberMe is received on a successful login using username and password. It is a long encrypted alphanumeric string.  
* X-Fingerprint is a random unique device identifier string.

The client-side is requested to send these headers with every request if the *Remember Me Token* is available.

## Session {#session}

*Session is not considered to be a complete separate authentication scheme as it is to be used by all other ones. Thus, to create a session you first need to authenticate using any of the main schemes.*

*Nevertheless, the session authentication can be considered to be the secondary authentication scheme for the Basic HTTP Authentication.*

After the initial authentication, i.e. the first API request with authentication data, the API service returns a response with an additional session\_id field delivering the ID of the just created session:

```

{
    "status": 200,
    "session_id": "1P8xuJ4UQIWrRin2HU35V390e1d28ad230d0957c783bed37a4abe1bf6adbbB5Bw0Ja5PWO0v26lEa6z"
}
```

This session ID **must** be supplied with all subsequent API requests in the X-Session-ID HTTP header:

```

X-Session-ID: 1P8xuJ4UQIWrRin2HU35V390e1d28ad230d0957c783bed37a4abe1bf6adbbB5Bw0Ja5PWO0v26lEa6z

```

Alternatively, the \_session\_id argument can be used instead.

Important: If you do not provide the session ID, each new request will create a new session. This won't only make your API requests be processed slower, but will also make it impossible for you to use some API features.

# Request {#request-1}

Contents

* [1 Headers](https://developer.kayako.com/api/v1/reference/request/#headers-1)  
  * [1.1 Accept](https://developer.kayako.com/api/v1/reference/request/#accept-1.1)  
  * [1.2 Content-Length](https://developer.kayako.com/api/v1/reference/request/#content-length-1.2)  
  * [1.3 Content-Type](https://developer.kayako.com/api/v1/reference/request/#content-type-1.3)  
* [2 Arguments and parameters](https://developer.kayako.com/api/v1/reference/request/#arguments-and-parameters-2)  
* [3 Body format](https://developer.kayako.com/api/v1/reference/request/#body-format-3)  
  * [3.1 URL-encoded](https://developer.kayako.com/api/v1/reference/request/#url-encoded-3.1)  
    * [3.1.1 CURL](https://developer.kayako.com/api/v1/reference/request/#curl-3.1.1)  
  * [3.2 JSON](https://developer.kayako.com/api/v1/reference/request/#json-3.2)  
    * [3.2.1 CURL](https://developer.kayako.com/api/v1/reference/request/#curl-3.2.1)  
  * [3.3 Multi-part](https://developer.kayako.com/api/v1/reference/request/#multi-part-3.3)  
    * [3.3.1 CURL](https://developer.kayako.com/api/v1/reference/request/#curl-3.3.1)  
  * [3.4 File upload](https://developer.kayako.com/api/v1/reference/request/#file-upload-3.4)

Here is a sample of the API request:

```

POST /api/v1/tests?_empty=false HTTP/1.1
Host: brewfictus.kayako.com
Accept: */*
Content-Length: 43
Content-Type: application/x-www-form-urlencoded

name=Caryn+Pryor&array_items=1,2,3&is_boolean=true

```

A valid API request has the request line with optional arguments (e.g. \_empty), HTTP request headers (e.g. Content-Type) and sometimes the body, that usually contains parameters (e.g. is\_boolean).

## Headers {#headers}

Here are some of HTTP headers that can/should be used in the requests:

Other request headers are reviewed in [Authentication](https://developer.kayako.com/api/v1/reference/authentication/), [File Upload](https://developer.kayako.com/api/v1/reference/file_upload/), [Caching](https://developer.kayako.com/api/v1/reference/caching/), [Security](https://developer.kayako.com/api/v1/reference/security/), [Special Options](https://developer.kayako.com/api/v1/reference/special_options/) and [Using JavaScript](https://developer.kayako.com/api/v1/reference/using_javascript/).

### **Accept** {#accept}

The Accept HTTP header **must** include application/json or \*/\*.

```

Accept: application/json

```

### **Content-Length** {#content-length}

Be sure to specify the size of the request body in the Content-Length HTTP header:

```

Content-Length: 53

```

### **Content-Type** {#content-type}

Depending on the format of the request body the Content-Type HTTP header must be set to:

* application/x-www-form-urlencoded for the URL-encoded format.  
* application/json for the JSON format.  
* multipart/form-data **with** the boundary for the Multi-part format.

```

Content-Type: application/x-www-form-urlencoded

```

## Arguments and parameters {#arguments-and-parameters}

We distinguish parameters, that are specified in the request URL (query), which we name "arguments", and parameters, that are specified in the request body, which we name just "parameters".

"Arguments" and "parameters" can be combined in a single API request (therefore, in theory, they can even have the same names).

Some special arguments are reviewed in [Partial Output](https://developer.kayako.com/api/v1/reference/partial_output/), [Pagination](https://developer.kayako.com/api/v1/reference/pagination/), [File Upload](https://developer.kayako.com/api/v1/reference/file_upload/), [Special Options](https://developer.kayako.com/api/v1/reference/special_options/) and [Using JavaScript](https://developer.kayako.com/api/v1/reference/using_javascript/).

## Body format {#body-format}

Body of a valid API request **must** be in one of the following formats:

### **URL-encoded** {#url-encoded}

This is a standard format of web forms and the simplest one.

This format is identified by the application/x-www-form-urlencoded value of the Content-Type HTTP request header:

```

Content-Type: application/x-www-form-urlencoded

```

In this format the body of the request must contain a single (long) line with name=value pairs of parameters joined by &. Values must be URL-encoded.

Example:

```

name=Caryn+Pryor&integer_number=123&float_number=1.5&&date=1441118415&is_boolean=1&array_items[]=1&array_items[]=2

```

For details about this format check [RFC 3986](https://tools.ietf.org/html/rfc3986).

#### CURL {#curl}

Example of the CURL command, that uses this format:

```

curl -X POST \
     -d 'name=Caryn Pryor' \
     -d integer_number=123 \
     -d float_number=1.5 \
     -d date=1441118415 \
     -d array_items[]=1 -d array_items[]=2
     -d is_boolean=true 'https://brewfictus.kayako.com/api/v1/tests&_empty=false'

```

### **JSON** {#json}

JSON is a standard format for APIs nowadays and the most flexible one. It is also used by the Kayako API as the response format.

For a JSON request the Content-Type HTTP request header must be set to application/json:

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

#### CURL {#curl-1}

Example of the CURL command, that uses this format:

```

curl -X POST \
     -H 'Content-Type: application/json' \
     -d '{"name": "Caryn Pryor",
          "integer_number": 123,
          "float_number": 1.5,
          "date": "2015-09-01T14:45:04+05:00",
          "is_boolean": true,
          "array_items": [1, 2]
         }' 'https://brewfictus.kayako.com/api/index.php?/v1/tests&_empty=false'

```

### **Multi-part** {#multi-part}

This is another standard format of web forms and the only one, that can be used to upload files. It's also the most complicated one.

Important: **Do not** use this format unless you need to upload files.

This format is identified by the Content-Type HTTP request header, that must be set to multipart/form-data and also must include the boundary:

```

Content-Type: multipart/form-data; boundary="1modcYGLAATJpapo8jhD4UwHbF5asu4u"

```

As this is one of the request formats, that can be used to upload files, it is also described in details in [File upload](https://developer.kayako.com/api/v1/reference/file_upload/).

If this format is used to deliver values for parameters, the corresponding "part" must include the parameter name in the name option of the Content-Disposition HTTP header as follows:

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

#### CURL {#curl-2}

Example of the CURL command, that uses this format:

```

curl -X POST \
     -F 'name=Caryn Pryor' \
     -F integer_number=123 \
     -F float_number=1.5 \
     -F date=1441118415 \
     -F array_items[]=1 -F array_items[]=2
     -F is_boolean=true 'https://brewfictus.kayako.com/api/v1/tests&_empty=false'

```

### **File upload** {#file-upload}

For request formats, that can be used to upload files, check [File upload](https://developer.kayako.com/api/v1/reference/file_upload/).

# Response {#response-1}

Contents

* [1 Status code](https://developer.kayako.com/api/v1/reference/response/#status-code-1)  
* [2 Headers](https://developer.kayako.com/api/v1/reference/response/#headers-2)  
* [3 Body](https://developer.kayako.com/api/v1/reference/response/#body-3)  
  * [3.1 Main fields](https://developer.kayako.com/api/v1/reference/response/#main-fields-3.1)  
  * [3.2 Errors, notifications and logs](https://developer.kayako.com/api/v1/reference/response/#errors-notifications-and-logs-3.2)  
    * [3.2.1 Errors](https://developer.kayako.com/api/v1/reference/response/#errors-3.2.1)  
    * [3.2.2 Notifications](https://developer.kayako.com/api/v1/reference/response/#notifications-3.2.2)  
    * [3.2.3 Logs](https://developer.kayako.com/api/v1/reference/response/#logs-3.2.3)

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
    "
data": {
        "id": 1,
        "name": "Test 1",
        "authentication_scheme": "NONE",
        "resource_type": "test",
        "resource_url": "https://brewfictus.kayako.com/api/v1/tests/1"
    },
    "resource": "test"
}

```

An API response has the status line, HTTP response headers (e.g., ETag) and often the body.

## Status code {#status-code}

An API response as a HTTP response includes the HTTP status code that can have the following values:

| Code | Message | Description |
| :---- | :---: | :---- |
| 200 | OK | The default code for successful responses. |
| 201 | Created | A resource has been created. |
| 304 | Not Modified | The cached resource has not been modified. Responses with this code do not include the body. See also [Caching](https://developer.kayako.com/api/v1/reference/caching/). |
| 400 | Bad Request | The request was malformed (and needs to be fixed before retrying). |
| 401 | Unauthorized | The resource requires the user to be authenticated. See also [Authentication](https://developer.kayako.com/api/v1/reference/authentication/). |
| 403 | Forbidden | The access to the resource is not allowed for the user. |
| 404 | Not Found | The resource does not exist or has been removed. |
| 405 | Method Not Allowed | Used HTTP method is not supported for the resource. |
| 406 | Not Acceptable | The Accept HTTP header of the request is missing or does not allow application/json. See [Request](https://developer.kayako.com/api/v1/reference/request/). |
| 412 | Precondition Failed | The request included a condition, that failed. See also [Caching](https://developer.kayako.com/api/v1/reference/caching/). |
| 426 | Upgrade Required | The API client or the system license should be upgraded. |
| 429 | Too Many Requests | The request has been rate limited. See also [Rate Limiting](https://developer.kayako.com/api/v1/reference/rate_limiting/). |
| 454 | Session Not Found | The session could not be loaded. See [Authentication](https://developer.kayako.com/api/v1/reference/authentication/). |
| 500 | Internal Server Error | There was an error on the server. |

## Headers {#headers-1}

The API service avoids using HTTP headers for delivering important information to API clients, except the Retry-After header that is described in [Rate Limiting](https://developer.kayako.com/api/v1/reference/rate_limiting/) and the X-CSRF-Token header that is described in [Security](https://developer.kayako.com/api/v1/reference/security/).

## Body {#body}

The body of the API response is a special JSON object, that delivers meta data and resource information to the API client.

### **Main fields** {#main-fields}

Here are the most important fields of the response message:

**Status**

The value of this field is (normally) identical to the HTTP status code of the API response.

**Data**

This field delivers the main information. It contains either the resource or the collection (i.e. array of resources).

**Resource**

This field contains the type of the resource delivered in the data field. For collections it's the type of the contained resource.

**Total Count**

This field is returned only with collections and contains the total number of items in the collection.

### **Errors, notifications and logs** {#errors,-notifications-and-logs}

The response can include three types of special messages:

* **Errors** are intended for API clients (and, therefore, are not localized).  
* **Notifications** are intended for end users (and are localized).  
* **Logs** are to be logged by API clients and are intended for their developers and maintainers.

#### Errors {#errors}

A response indicates an error, if its status is not **200** (OK) or **201** (Created) and the errors response field contains one or more error objects.

If the API client receives a response with error(s), it should analyze the code field of each error object and perform appropriate actions (report the error to the user, fix the request and retry, and so on).

Some error objects can include the following additional fields:

**Parameter**

The \`parameter\` field holds the name of the parameter, that caused the error.

**Parameters**

If there are several parameters, that caused the error, they are listed in the \`parameters\` field.

**Pointer**

If the parameter is an array or a JSON object, the error object can additionally include the \`pointer\` field containing the exact path to the value in the parameter.

Example:

```

{
    "status": 400,
    "
errors": [
        {
            "code": "RESOURCE_ACTION_NOT_AVAILABLE",
            "message": "Not supported method, misspelled action name or action is not available for the resource",
            "more_info": "https://developer.kayako.com/api/v1/reference/errors/RESOURCE_ACTION_NOT_AVAILABLE"
        }
    ]
}
```

See also [Errors](https://developer.kayako.com/api/v1/reference/errors/ACTION_FAILED/) for what each error code means.

#### Notifications {#notifications}

Any response, successful or not, can include one or more notification objects in the notifications field.

The notification object contains the type field, that indicates the severity of the message.

The type can be:

* ERROR  
* WARNING  
* INFO  
* SUCCESS

Each notification message (of any type) **must** be displayed to the user by the API client.

Additionally, the notification object can include the following fields:

**Sticky**

If the sticky field is set to true, the corresponding notification message should remain on the screen of the API client as reasonably long as possible.

**Related URL**

If the related\_url field contains a URL, the API client may provide a UI element somewhere in the notification window, that would allow the user to check the resource represented by this URL. **Or**:

**Related HREF**

If the related\_href field contains a URL, the API client should provide a UI element somewhere in the notification window, that would allow the user to open this URL in a browser.

**Related label**

If the related\_label field is specified, its value should be used as a label for the aforementioned UI element.

Example:

```

{
    "status": 200,
    "
notifications": [
        {
            "type": "INFO",
            "message": "A message has been sent to your email",
        }
    ]
}

```

#### Logs {#logs}

Any response, successful or not, can include one or more log messages in the logs field.

The log object contains the level field, that indicates the severity of the problem.

The level can be:

* ERROR  
* WARNING  
* NOTICE

Logs are intended for developers and administrators of the API client and contain important information about issues in its code or configuration. Therefore, the API client **should** write logs to some place, where developers and administrators can read them.

Example:

```

{
    "status": 200,
    "
logs": [
        {
            "level": "NOTICE",
            "message": "To avoid long delays instead of supplying username and password with each request use just the session id"
        }
    ]
}
```

# Response {#response-2}

Contents

* [1 Status code](https://developer.kayako.com/api/v1/reference/response/#status-code-1)  
* [2 Headers](https://developer.kayako.com/api/v1/reference/response/#headers-2)  
* [3 Body](https://developer.kayako.com/api/v1/reference/response/#body-3)  
  * [3.1 Main fields](https://developer.kayako.com/api/v1/reference/response/#main-fields-3.1)  
  * [3.2 Errors, notifications and logs](https://developer.kayako.com/api/v1/reference/response/#errors-notifications-and-logs-3.2)  
    * [3.2.1 Errors](https://developer.kayako.com/api/v1/reference/response/#errors-3.2.1)  
    * [3.2.2 Notifications](https://developer.kayako.com/api/v1/reference/response/#notifications-3.2.2)  
    * [3.2.3 Logs](https://developer.kayako.com/api/v1/reference/response/#logs-3.2.3)

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
    "
data": {
        "id": 1,
        "name": "Test 1",
        "authentication_scheme": "NONE",
        "resource_type": "test",
        "resource_url": "https://brewfictus.kayako.com/api/v1/tests/1"
    },
    "resource": "test"
}

```

An API response has the status line, HTTP response headers (e.g., ETag) and often the body.

## Status code {#status-code-1}

An API response as a HTTP response includes the HTTP status code that can have the following values:

| Code | Message | Description |
| :---- | :---: | :---- |
| 200 | OK | The default code for successful responses. |
| 201 | Created | A resource has been created. |
| 304 | Not Modified | The cached resource has not been modified. Responses with this code do not include the body. See also [Caching](https://developer.kayako.com/api/v1/reference/caching/). |
| 400 | Bad Request | The request was malformed (and needs to be fixed before retrying). |
| 401 | Unauthorized | The resource requires the user to be authenticated. See also [Authentication](https://developer.kayako.com/api/v1/reference/authentication/). |
| 403 | Forbidden | The access to the resource is not allowed for the user. |
| 404 | Not Found | The resource does not exist or has been removed. |
| 405 | Method Not Allowed | Used HTTP method is not supported for the resource. |
| 406 | Not Acceptable | The Accept HTTP header of the request is missing or does not allow application/json. See [Request](https://developer.kayako.com/api/v1/reference/request/). |
| 412 | Precondition Failed | The request included a condition, that failed. See also [Caching](https://developer.kayako.com/api/v1/reference/caching/). |
| 426 | Upgrade Required | The API client or the system license should be upgraded. |
| 429 | Too Many Requests | The request has been rate limited. See also [Rate Limiting](https://developer.kayako.com/api/v1/reference/rate_limiting/). |
| 454 | Session Not Found | The session could not be loaded. See [Authentication](https://developer.kayako.com/api/v1/reference/authentication/). |
| 500 | Internal Server Error | There was an error on the server. |

## Headers {#headers-2}

The API service avoids using HTTP headers for delivering important information to API clients, except the Retry-After header that is described in [Rate Limiting](https://developer.kayako.com/api/v1/reference/rate_limiting/) and the X-CSRF-Token header that is described in [Security](https://developer.kayako.com/api/v1/reference/security/).

## Body {#body-1}

The body of the API response is a special JSON object, that delivers meta data and resource information to the API client.

### **Main fields** {#main-fields-1}

Here are the most important fields of the response message:

**Status**

The value of this field is (normally) identical to the HTTP status code of the API response.

**Data**

This field delivers the main information. It contains either the resource or the collection (i.e. array of resources).

**Resource**

This field contains the type of the resource delivered in the data field. For collections it's the type of the contained resource.

**Total Count**

This field is returned only with collections and contains the total number of items in the collection.

### **Errors, notifications and logs** {#errors,-notifications-and-logs-1}

The response can include three types of special messages:

* **Errors** are intended for API clients (and, therefore, are not localized).  
* **Notifications** are intended for end users (and are localized).  
* **Logs** are to be logged by API clients and are intended for their developers and maintainers.

#### Errors {#errors-1}

A response indicates an error, if its status is not **200** (OK) or **201** (Created) and the errors response field contains one or more error objects.

If the API client receives a response with error(s), it should analyze the code field of each error object and perform appropriate actions (report the error to the user, fix the request and retry, and so on).

Some error objects can include the following additional fields:

**Parameter**

The \`parameter\` field holds the name of the parameter, that caused the error.

**Parameters**

If there are several parameters, that caused the error, they are listed in the \`parameters\` field.

**Pointer**

If the parameter is an array or a JSON object, the error object can additionally include the \`pointer\` field containing the exact path to the value in the parameter.

Example:

```

{
    "status": 400,
    "
errors": [
        {
            "code": "RESOURCE_ACTION_NOT_AVAILABLE",
            "message": "Not supported method, misspelled action name or action is not available for the resource",
            "more_info": "https://developer.kayako.com/api/v1/reference/errors/RESOURCE_ACTION_NOT_AVAILABLE"
        }
    ]
}
```

See also [Errors](https://developer.kayako.com/api/v1/reference/errors/ACTION_FAILED/) for what each error code means.

#### Notifications {#notifications-1}

Any response, successful or not, can include one or more notification objects in the notifications field.

The notification object contains the type field, that indicates the severity of the message.

The type can be:

* ERROR  
* WARNING  
* INFO  
* SUCCESS

Each notification message (of any type) **must** be displayed to the user by the API client.

Additionally, the notification object can include the following fields:

**Sticky**

If the sticky field is set to true, the corresponding notification message should remain on the screen of the API client as reasonably long as possible.

**Related URL**

If the related\_url field contains a URL, the API client may provide a UI element somewhere in the notification window, that would allow the user to check the resource represented by this URL. **Or**:

**Related HREF**

If the related\_href field contains a URL, the API client should provide a UI element somewhere in the notification window, that would allow the user to open this URL in a browser.

**Related label**

If the related\_label field is specified, its value should be used as a label for the aforementioned UI element.

Example:

```

{
    "status": 200,
    "
notifications": [
        {
            "type": "INFO",
            "message": "A message has been sent to your email",
        }
    ]
}

```

#### Logs {#logs-1}

Any response, successful or not, can include one or more log messages in the logs field.

The log object contains the level field, that indicates the severity of the problem.

The level can be:

* ERROR  
* WARNING  
* NOTICE

Logs are intended for developers and administrators of the API client and contain important information about issues in its code or configuration. Therefore, the API client **should** write logs to some place, where developers and administrators can read them.

Example:

```

{
    "status": 200,
    "
logs": [
        {
            "level": "NOTICE",
            "message": "To avoid long delays instead of supplying username and password with each request use just the session id"
        }
    ]
}
```

# Partial Output {#partial-output}

Many resources have many fields and nested resources, which in turn also have many fields and nested resources, and so on. This can make a response body huge.

To address this issue Kayako offers the following two solutions:

* Control, which types of resources will be included into the response.  
* Control, which resource fields at which path will be included into the response.

## By resource types {#by-resource-types}

Kayako API service allows to specify, which types of resources should be included into the response. This can be controlled by the include argument, that should contain the comma-separated list of resource types.

The resource type is what is specified in the resource\_type field of the resource, e.g, user, case.

### **The include argument** {#the-include-argument}

By default, the API service includes only *references* to nested resources, i.e., includes only id and resource\_type fields of resources, e.g.:

```

"creator": {
    "id": 1,
    "resource_type": "user"
}

```

To include all nested resources (instead of just their references) set include to \* (all types).

To include only certain types of resources, list these types in the include argument (separate by commas), e.g.:

```

?include=user,case

```

## By resource fields {#by-resource-fields}

Kayako API service allows to control, which resource fields should be included into the response. This can be done by specifying field names in the fields argument.

### **Field categories** {#field-categories}

Resource fields in Kayako API fall into three categories:

* Fields, that are always returned (like id).  
* Fields, that are returned by **default**.  
* Fields, that are not returned by default.

There are also hidden fields, which are never returned (used only to set values \- e.g. password).

### **The fields argument** {#the-fields-argument}

To control, which fields should be returned in the response body, you can use the fields argument. In this argument you can specify the comma-separated list of field names, which can be prepended with optional modifiers.

#### Modifiers {#modifiers}

The following modifiers are supported:

* \+ instructs to include the field name into the response  
* \- instructs to exclude the field name from the response

Example:

```

?fields=+full_name,-designation

```

#### Nested fields {#nested-fields}

To control fields of a nested resource specify corresponding rules in parentheses after the name of the field, that holds the nested resource, e.g.:

```

?fields=+role(+title,-type)

```

Certainly, to be able to control, which fields of nested resources should be included into the response, you must include these resources into the response by listing their types in the include argument.

#### Default display {#default-display}

The \+ modifier in display rules is actually optional and can be omitted, but this will change the default inclusion policy of the resource's fields.

Thus, if a field, that should be returned by default, is specified in display rules without the \+ modifier, all other **default** fields will no more be returned by default.

Thus:

* fields=title will return only id, and title.  
* fields=+title will return id, title and other fields, that should be returned by default.  
* fields=ip\_restriction will return id, title, other default fields and the ip\_restriction field.

Here title is a field, that is shown by default, and ip\_restriction is a field, that is omitted by default.

#### Wildcard for all fields {#wildcard-for-all-fields}

You can also request to return **all** available fields of the resource by specifying \* as the field name.

Examples: fields=\*, fields=role(\*)

This, however, won't affect fields of nested resources.

The special rule fields=\*(\*) can also be used to request **all** fields of **all** nested resources at any nesting level.

# Pagination {#pagination}

Contents

* [1 Offset-based](https://developer.kayako.com/api/v1/reference/pagination/#offset-based-1)  
* [2 Cursor-based](https://developer.kayako.com/api/v1/reference/pagination/#cursor-based-2)  
* [3 Date-based](https://developer.kayako.com/api/v1/reference/pagination/#date-based-3)

By default the API returns first 10 items of the collection. This can be changed with the limit argument.

To navigate through "pages" of the collection you can use the following pagination styles:

## Offset-based {#offset-based}

It's the default pagination style, which is supported by **all** resources.

The current position in the collection is controlled by the special offset argument. Like in arrays the offset starts at 0 (the default offset) and ends at the total count \- 1\.

Example:

| Page | Arguments |
| :---- | :---: |
| 1st | offset=0\&limit=25 |
| 2nd | offset=25\&limit=25 |
| 3rd | offset=50\&limit=25 |

Consider using the If-Match HTTP header to ensure, that the collection you browse was not changed. See also [Caching](https://developer.kayako.com/api/v1/reference/caching/).

## Cursor-based {#cursor-based}

The cursor-based pagination helps to ensure, that new or removed items won't shift your position in the collection. However, **not** all resources support this pagination style.

Each item of a collection has an ID, which can be used to determine the position in the collection.

![][image1]

Here (assuming limit=10):

* before\_id=15 will return ID\#43 \- ID\#19 and is same as offset=0  
* after\_id=19 will return ID\#15 \- ID\#5 and is same as offset=10

Also note, that if the collection gets new items:

![][image2]

The before\_id=15 will still return ID\#43 \- ID\#19.

Same if the item with ID\#15 will be removed (before\_id does not require the item with the ID to exist).

Resources, that support the cursor-based pagination, are ordered by ID, ascending or descending.

The before\_id and after\_id arguments consider the position of the item in the collection from the start, and **not** the numeric value of the ID.

Also, unlike the offset-based pagination, for which we can just decrement or increment the offset value to retrieve previous and next pages accordingly, for the cursor-based pagination we can determine only the very previous and next pages, as they are relative to the current one (thus, for before\_id we use the ID of the first item on the page and for after\_id we use the ID of the last one).

Luckily, for **some** resources the API response includes links to the first and last page of the collection:

```

{
    "status": 200,
    "data": [ ... ],
    "resource": "test",
    "limit": 10,
    "total_count": 25,
    "first_url": "http://v5.kayako.com/api/v1/tests?before_id=11&count=25",
    "previous_url": "http://v5.kayako.com/api/v1/tests?before_id=11&count=25",
    "next_url": "http://v5.kayako.com/api/v1/tests?after_id=20&count=25",
    "last_url": "http://v5.kayako.com/api/v1/tests?after_id=20&count=25"
}

```

## Date-based {#date-based}

The date-based pagination is useful when you want to "follow" the collection (e.g., to retrieve new items). However, **not** all resources support this pagination style.

Many resources have a timestamp field, that holds a distinct date of the resource. Such field can be used to determine the position of the resource in the collection.

![][image3]

Here (assuming limit=10):

* since=2015-08-28T20:34:59+05:00 will return ID\#45 \- ID\#28 and is same as offset=0  
* until=2015-08-30T16:58:07+05:00 will return ID\#22 \- ID\#16 and is same as offset=10

Resources, that support the date-based pagination, are ordered by the date, ascending or descending.

Unlike arguments of the the cursor-based pagination since and until arguments consider the numeric value of the date \- **not** offset from the start of the collection.

Like arguments of the the cursor-based pagination since and until arguments do **not** require an item with the referenced date to exist.

A resource supports either the cursor-based padination or the date-based one \- **never** both.

Note, that taking the example above it's also easy to get new items of the collection just by using since=2015-08-31T12:45:30+05:00.

Like the cursor-based pagination the date-based one is also resistant to addition and/or removal of the collection's items.

Also, like for the cursor-based pagination we can determine only the very previous and next pages of the collection (we can use the date of the first item of the current page for since or until (depends on the order) and the date of the last item of the page for until or since).

To help here **some** resources include links to the first and last page of the collection into the response.

Important: The date of the resource in the collection is **not** always unique, what means that the API client **must** be ready, that the collection may contain more items than requested (by the limit argument).

# File Upload {#file-upload-1}

Contents

* [1 Two-step upload](https://developer.kayako.com/api/v1/reference/file_upload/#two-step-upload-1)  
  * [1.1 Upload to File resource](https://developer.kayako.com/api/v1/reference/file_upload/#upload-to-file-resource-1.1)  
  * [1.2 Associate file with resource](https://developer.kayako.com/api/v1/reference/file_upload/#associate-file-with-resource-1.2)  
* [2 Single-step upload](https://developer.kayako.com/api/v1/reference/file_upload/#single-step-upload-2)  
  * [2.1 Upload file content as request body](https://developer.kayako.com/api/v1/reference/file_upload/#upload-file-content-as-request-body-2.1)  
    * [2.1.1 File name](https://developer.kayako.com/api/v1/reference/file_upload/#file-name-2.1.1)  
    * [2.1.2 Field name](https://developer.kayako.com/api/v1/reference/file_upload/#field-name-2.1.2)  
    * [2.1.3 File size](https://developer.kayako.com/api/v1/reference/file_upload/#file-size-2.1.3)  
    * [2.1.4 Checksum](https://developer.kayako.com/api/v1/reference/file_upload/#checksum-2.1.4)  
    * [2.1.5 Complete example](https://developer.kayako.com/api/v1/reference/file_upload/#complete-example-2.1.5)  
      * [2.1.5.1 CURL](https://developer.kayako.com/api/v1/reference/file_upload/#curl-2.1.5.1)  
  * [2.2 Using multi-part form data](https://developer.kayako.com/api/v1/reference/file_upload/#using-multi-part-form-data-2.2)  
    * [2.2.1 Complete example](https://developer.kayako.com/api/v1/reference/file_upload/#complete-example-2.2.1)  
      * [2.2.1.1 CURL](https://developer.kayako.com/api/v1/reference/file_upload/#curl-2.2.1.1)

In order to make file uploading as easy and flexible as possible we support several scenarios for this procedure.

## Two-step upload {#two-step-upload}

With [Files API](https://developer.kayako.com/api/v1/general/files) you can first upload files separately and then "attach" them to appropriate resources.

Resources, that support this scenario, declare special File resource handling fields, that end with \_file\_id (for single file) or with \_file\_ids (for multiple files).

With this scenario you can also re-use uploaded files (i.e. "attach" the same file to different resources).

### **Upload to File resource** {#upload-to-file-resource}

During the first step you upload files to the File resource using the POST HTTP method as described [here](https://developer.kayako.com/api/v1/general/files#Add-a-file).

```

POST /api/v1/files.json HTTP/1.1
Host: brewfictus.kayako.com
Content-Disposition: attachment; filename="coffee.png"
Content-Length: 2347
Content-Type: image/png

...

```

*This is, in fact, the single-step upload to the File resource.*

### **Associate file with resource** {#associate-file-with-resource}

For each uploaded file [Files API](https://developer.kayako.com/api/v1/general/files) generates unique ID, that can be used to associate the file with a resource during the second step. To do this pass the ID as a value for a resource's file handling field.

```

PUT /api/v1/profile.json HTTP/1.1
Host: brewfictus.kayako.com
Content-Type: application/x-www-form-urlencoded
Content-Length: 17

avatar_file_id=19

```

## Single-step upload {#single-step-upload}

The single-step upload technique is used to upload files to resources directly.

### **Upload file content as request body** {#upload-file-content-as-request-body}

This is the simplest uploading technique from the low-level technical perspective.

To upload a file you can just pass its contents as the request body.

#### File name {#file-name}

To specify the name of the uploaded file (required in most cases) use the Content-Desposition HTTP header:

```

POST /api/v1/files.json HTTP/1.1
Host: brewfictus.kayako.com
Content-Disposition: attachment; filename="coffee.png"

```

Alternatively, you can use the \_filename argument:

```

/api/v1/files.json?_filename=coffee.png

```

#### Field name {#field-name}

If the API end point expects a field name for the uploaded file (e.g. if multiple target fields are supported) use the Content-Desposition HTTP header as follows:

```

POST /api/v1/files.json HTTP/1.1
Host: brewfictus.kayako.com
Content-Disposition: attachment; name="avatar"; filename="coffee.png"

```

Alternatively, you can use the \_field argument:

```

/api/v1/files.json?_field=avatar&_filename=coffee.png

```

#### File size {#file-size}

We strongly recommend to always specify the file size in the Content-Length HTTP header of the request.

```

POST /api/v1/files.json HTTP/1.1
Host: brewfictus.kayako.com
Content-Length: 2347

```

This way you also ensure that an incomplete file won't be accepted by the server.

#### Checksum {#checksum}

To ensure, that content of the file was not damaged during the network transfer include the Content-MD5 header with the MD5 hash of the file into your request:

```

POST /api/v1/files.json HTTP/1.1
Host: brewfictus.kayako.com
Content-MD5: f9e590b40fe31ecd4e0c4fc3f3c0b9fd

```

Alternatively, you can use the \_md5 argument:

```

/api/v1/files.json?_md5=f9e590b40fe31ecd4e0c4fc3f3c0b9fd

```

#### Complete example {#complete-example}

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

##### CURL {#curl-3}

Here is the example of the CURL command used for uploading files with this technique.

```

curl -X POST \
     -H 'Content-Type: image/png' \
     -d @coffee.png 'https://brewfictus.kayako.com/api/v1/files.json?_filename=coffee.png'

```

By default CURL always adds Content-Type: application/x-www-form-urlencoded, what makes the API server think, that the body contains parameters. So, to upload files as the body always specify the Content-Type, e.g. application/octet-stream.

The special CURL file uploading mode is also supported:

```

curl -X POST \
     -T coffee.png 'https://brewfictus.kayako.com/api/v1/files.json?_filename=coffee.png'

```

### **Using multi-part form data** {#using-multi-part-form-data}

This is the most commonly used uploading technique, which is used by web browsers to upload files to HTTP servers by default. This is also the only technique, that allows to upload files and to send parameters in a single request body. Additionally, this technique can be used to upload multiple files at once.

This technique is identified by the Content-Type HTTP request header, which must be set to multipart/form-data.

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

* Content-Disposition is **required** and must be set to form-data. Additionally, it may include the name (field name) and the filename.  
* Content-Length is strongly recommended and must be set to the size of the content delivered inside the part.  
* Content-MD5 can be specified to ensure that data won't be saved in a damaged state.  
* Content-Type can be used to specify the MIME type of the file.  
* Content-Transfer-Encoding to specify encoding of the content. The binary encoding is recommended.

See also [RFC 2388](https://tools.ietf.org/html/rfc2388) for details.

#### Complete example {#complete-example-1}

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

##### CURL {#curl-4}

Here is the example of the CURL command, that uses this format:

```

curl -X POST \
     -F "files[]=@coffee.png" \
     -F "files[]=@cappuccino.png" 'https://brewfictus.kayako.com/api/v1/files.json'
```

# Caching {#caching}

Contents

* [1 ETag response header](https://developer.kayako.com/api/v1/reference/caching/#etag-response-header-1)  
  * [1.1 If-Match request header](https://developer.kayako.com/api/v1/reference/caching/#if-match-request-header-1.1)  
  * [1.2 If-None-Match request header](https://developer.kayako.com/api/v1/reference/caching/#if-none-match-request-header-1.2)  
* [2 Last-Modified response header](https://developer.kayako.com/api/v1/reference/caching/#last-modified-response-header-2)  
  * [2.1 If-Modified-Since request header](https://developer.kayako.com/api/v1/reference/caching/#if-modified-since-request-header-2.1)  
  * [2.2 If-Unmodified-Since request header](https://developer.kayako.com/api/v1/reference/caching/#if-unmodified-since-request-header-2.2)  
* [3 AJAX Caching Mode](https://developer.kayako.com/api/v1/reference/caching/#ajax-caching-mode-3)

We strongly advise you to implement caching in your API client.

Caching does not only allow to reduce network load, but it also:

* Helps to ensure that the resource you work with has not been modified by others  
* Allows to fetch only new or updated resources  
* Reduces load of our API service this way protecting its quality

These makes caching implementation significant for API clients.

## ETag response header {#etag-response-header}

An API response can include the ETag HTTP header holding the hash of the resource or collection that comes with the response:

```

HTTP/1.1 200 OK
Content-Type: application/json
ETag: 1653fb55ce4603b2f3def1903eb81333
X-API-Version: 1

```

In our API service the value of the ETag HTTP header represents the **state** of the delivered resource itself, i.e. does not include nested resources. This means that for the collection it considers only IDs of contained resources.

### **If-Match request header** {#if-match-request-header}

To ensure that you work with the same version of the resource include the If-Match HTTP header with the ETag value into your API request:

```

PUT /api/v1/base/user/1 HTTP/1.1
Host: brewfictus.kayako.com
If-Match: 1653fb55ce4603b2f3def1903eb81333

```

In this case the action will be performed only if the specified hash matches the resource's current hash, i.e. if the resource has not been modified.

Otherwise, the API service will return the RESOURCE\_MODIFIED error with the **412** (Precondition Failed) HTTP status code.

Consider always using the If-Match or the If-Unmodified-Since HTTP header with PUT and DELETE requests.

### **If-None-Match request header** {#if-none-match-request-header}

To retrieve a resource only if it has been modified include the If-None-Match HTTP header with the ETag value into your API request:

```

GET /api/v1/base/user/1 HTTP/1.1
Host: brewfictus.kayako.com
If-None-Match: 1653fb55ce4603b2f3def1903eb81333

```

If the resource was not modified the API service will return the **304** (Not Modified) HTTP status code (with no body).

Consider always using the If-None-Match or the If-Modified-Since HTTP header with GET requests to enable client-side caching.

## Last-Modified response header {#last-modified-response-header}

An API response can include the Last-Modified HTTP header holding the date when the resource or collection was modified last time:

```

HTTP/1.1 200 OK
Content-Type: application/json
Last-Modified: Fri, 14 Aug 2015 18:39:41 +0000
X-API-Version: 1

```

### **If-Modified-Since request header** {#if-modified-since-request-header}

To retrieve a resource only if it has been modified since the last time you saw it include the If-Modified-Since HTTP header with the appropriate value into your API request:

```

GET /api/v1/base/user/1 HTTP/1.1
Host: brewfictus.kayako.com
If-Modified-Since: Fri, 14 Aug 2015 18:39:41 +0000

```

If the resource was not modified the API service will return the **304** (Not Modified) HTTP status code (with no body).

Consider always using the If-Modified-Since or the If-None-Match HTTP header with GET requests to enable client-side caching.

### **If-Unmodified-Since request header** {#if-unmodified-since-request-header}

To ensure that the resource was not modified since the last time you saw it include the If-Unmodified-Since HTTP header with the appropriate value into your API request:

```

PUT /api/v1/base/user/1 HTTP/1.1
Host: brewfictus.kayako.com
If-Unmodified-Since: Fri, 14 Aug 2015 18:39:41 +0000

```

If the resource was modified the API service will return the RESOURCE\_MODIFIED error with the **412** (Precondition Failed) HTTP status code.

Consider always using the If-Unmodified-Since or the If-Match HTTP header with PUT and DELETE requests.

## AJAX Caching Mode {#ajax-caching-mode}

*The default algorithm of generating values for the ETag and the Last-Modified headers slightly differs from what is expected by web browsers and proxies. Thus, pure HTTP declares the ETag value as a hash of the content while REST API uses it as a hash of the resource.*

As the default caching mode can cause some unexpected behavior of the API when used in a web browser or through a HTTP proxy we introduced the special AJAX mode.

In the AJAX caching mode values of the ETag and the Last-Modified HTTP headers represent a version of the content that also includes related resources. Therefore, this mode **should not** be used for the concurrency control.

The AJAX caching mode gets enabled when the API request contains the X-Requested-With HTTP header with the special value XMHTTPRequest (such header and its value is commonly used by web browsers' JavaScript engines).

# Security {#security}

Contents

* [1 CSRF protection](https://developer.kayako.com/api/v1/reference/security/#csrf-protection-1)  
  * [1.1 Use protected sessions](https://developer.kayako.com/api/v1/reference/security/#use-protected-sessions-1.1)  
  * [1.2 Protect API requests](https://developer.kayako.com/api/v1/reference/security/#protect-api-requests-1.2)  
  * [1.3 Disable CSRF protection](https://developer.kayako.com/api/v1/reference/security/#disable-csrf-protection-1.3)  
* [2 JavaScript](https://developer.kayako.com/api/v1/reference/security/#javascript-2)  
1. When using [OAuth 2.0](https://developer.kayako.com/api/v1/reference/authentication/#oauth-2-0-1.2), be sure to keep the OAuth secret safe.  
2. Avoid using [Basic HTTP authentication](https://developer.kayako.com/api/v1/reference/authentication/#basic-http-authentication-1.1) scheme, when possible.

## CSRF protection {#csrf-protection}

By default, each API session is protected with the CSRF token.

You can read more about CSRF [here](https://en.wikipedia.org/wiki/Cross-site_request_forgery).

### **Use protected sessions** {#use-protected-sessions}

Unless the CSRF protection is explicitly disabled during authentication, the successful authentication response will contain the session token in the X-CSRF-Token response header (in addition to the session ID in the response body):

```

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

### **Protect API requests** {#protect-api-requests}

If the session is protected with the CSRF token, this token should be supplied with every API request. This can be done via the X-CSRF-Token request header, as follows:

```

POST /api/v1/tests.json HTTP/1.1
Host: brewfictus.kayako.com
X-CSRF-Token: DBYmfYEjHNzXI1tvnUAbu8xxD9gWH6bnTVTuqj2RAc1w2fuwuOTCK01yFLO3bksYfXAdCzABauGfZChfivS2BHIc0a5r

```

The CSRF token is required for unsafe HTTP methods POST, PUT and DELETE. So, if it's not supplied, the API service will return the [CSRF\_FAILED](https://developer.kayako.com/api/v1/reference/errors/CSRF_FAILED/) error.

### **Disable CSRF protection** {#disable-csrf-protection}

The CSRF protection can be disabled for new sessions by adding the X-CSRF header in the authentication request (that creates the session), as follows:

```

X-CSRF: false

```

## JavaScript {#javascript}

Use [CORS](https://developer.kayako.com/api/v1/reference/using_javascript/#cors-cross-origin-resource-sharing) instead of [JSONP](https://developer.kayako.com/api/v1/reference/using_javascript/#jsonp-json-with-padding) to access the API service from JavaScript, when possible.

# Rate Limiting {#rate-limiting}

To protect the quality of our API service we may enable rate limits for some actions of some API resources.

If you exceed such rate limit you get the HTTP response:

```

HTTP/1.1 429 Too Many Requests
Content-Type: application/json
Retry-After: 59
X-API-Version: 1

{
    "status": 429,
    "
errors": [
        {
            "code": "RATE_LIMIT_REACHED",
            "message": "The rate limit for this action was reached",
            "more_info": "https://developer.kayako.com/api/v1/reference/errors/RATE_LIMIT_REACHED"
        }
    ]
}

```

Such response will always include the Retry-After HTTP header holding the number of seconds in which you can send your request again.

API rate limits are defined per minute.

# Special Options {#special-options}

Contents

* [1 Letter case](https://developer.kayako.com/api/v1/reference/special_options/#letter-case-1)  
* [2 Empty fields](https://developer.kayako.com/api/v1/reference/special_options/#empty-fields-2)  
* [3 Flat mode](https://developer.kayako.com/api/v1/reference/special_options/#flat-mode-3)

## Letter case {#letter-case}

There are different naming conventions recommended for different programming languages, some companies and individuals prefer to use own naming conventions for their tools. Therefore, Kayako decided to help here by introducing support of different letter cases for names used in our API.

The special \_case argument can be used to instruct the API service to return names in these letter cases:

| Case | \_case | Sample |
| :---- | :---: | :---- |
| Snake | \_case=snake | snake\_case |
| Camel | \_case=camel | camelCase |
| Pascal | \_case=pascal | PascalCase |

By default the API service returns names in the "snake" case.

Additionally, the API service can understand names passed in API requests in all these cases.

Examples:

* fullName and FullName are equivalent to full\_name  
* \_Case is equivalent to \_case

## Empty fields {#empty-fields}

By default, empty fields (that contain null values or empty arrays) are included into the API response for the sake of consistency. This usually makes the response slightly bigger and, therefore, can be undesirable.

To remove fields from the API response, if their values are empty, use the \_empty argument as follows:

```

?_empty=false

```

Alternatively, you can add the no\_empty option to the X-Options HTTP header (separate options with ,).

## Flat mode {#flat-mode}

In the default mode the API response can include some resources multiple times, if they appear as nested resources at different levels and/or under different containing resources. Each copy of such resource certainly makes the response message slightly bigger.

The special "flat" mode can be used to optimize the response message and, sometimes, to reduce its size by deliverying related resources separately under the special resources field of the response object.

This mode can be activated by the \_flat argument:

```

?_flat=true

```

Alternatively, you can use the X-Options HTTP header with the flat option (separated by , from other ones, if any).

Here is an example of the API response in the "flat" mode:

```

{
    "status": 200,
    "
data": {
        "id": 1,
        "name": "Test 1",
        "session_id": "OK8tYiWqIbWGDTK93GX2gnNpUQzLA9c013929a217d98f4d1bc1aa751676f05b9b072f46ZWMLEH0fH76NWlmQuhzCxCKfqnff",
        "authentication_scheme": "BASIC",
        "is_base_installed": true,
        "
user": {
            "id": 1,
            "resource_type": "user"
        },
        "is_odd": true,
        "generation_time": 0.000134,
        "resource_type": "test",
        "resource_url": "https://brewfictus.kayako.com/api/v1/tests/1"
    },
    "resource": "test",
    "
resources": {
        "
role": {
            "
1": {
                "id": 1,
                "title": "Agent",
                "type": "AGENT",
                "created_at": "2015-07-21T04:30:13+05:00",
                "updated_at": "2015-07-21T04:30:13+05:00",
                "resource_type": "role",
                "resource_url": "https://brewfictus.kayako.com/api/v1/roles/1"
            }
        },
        "
identity_domain": {
            "
5": {
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
        "
organization": {
            "
7": {
                "id": 7,
                "name": "Brewfictus",
                "is_shared": false,
                "
domains": [
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
        "
business_hour": {
            "
1": {
                "id": 1,
                "title": "US office hours",
                "
zones": {
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
        "
team": {
            "
1": {
                "id": 1,
                "title": "Growth",
                "
businesshour": {
                    "id": 1,
                    "resource_type": "business_hour"
                },
                "created_at": "2015-07-21T04:30:13+05:00",
                "updated_at": "2015-07-21T04:30:13+05:00",
                "resource_type": "team",
                "resource_url": "https://brewfictus.kayako.com/api/v1/teams/1"
            }
        },
        "
identity_email": {
            "
1": {
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
        "
user": {
            "
1": {
                "id": 1,
                "full_name": "Charlotte Küchler",
                "designation": "Community Manager",
                "is_enabled": true,
                "
role": {
                    "id": 1,
                    "resource_type": "role"
                },
                "avatar": "https://brewfictus.kayako.com/avatar/get/aed21e-7619-5cb3-bbae-983015d3a",
                "agent_case_access": "ALL",
                "organization_case_access": null,
                "
organization": {
                    "id": 7,
                    "resource_type": "organization"
                },
                "
teams": [
                    {
                        "id": 1,
                        "resource_type": "team"
                    }
                ],
                "
emails": [
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

# Special Options {#special-options-1}

Contents

* [1 Letter case](https://developer.kayako.com/api/v1/reference/special_options/#letter-case-1)  
* [2 Empty fields](https://developer.kayako.com/api/v1/reference/special_options/#empty-fields-2)  
* [3 Flat mode](https://developer.kayako.com/api/v1/reference/special_options/#flat-mode-3)

## Letter case {#letter-case-1}

There are different naming conventions recommended for different programming languages, some companies and individuals prefer to use own naming conventions for their tools. Therefore, Kayako decided to help here by introducing support of different letter cases for names used in our API.

The special \_case argument can be used to instruct the API service to return names in these letter cases:

| Case | \_case | Sample |
| :---- | :---: | :---- |
| Snake | \_case=snake | snake\_case |
| Camel | \_case=camel | camelCase |
| Pascal | \_case=pascal | PascalCase |

By default the API service returns names in the "snake" case.

Additionally, the API service can understand names passed in API requests in all these cases.

Examples:

* fullName and FullName are equivalent to full\_name  
* \_Case is equivalent to \_case

## Empty fields {#empty-fields-1}

By default, empty fields (that contain null values or empty arrays) are included into the API response for the sake of consistency. This usually makes the response slightly bigger and, therefore, can be undesirable.

To remove fields from the API response, if their values are empty, use the \_empty argument as follows:

```

?_empty=false

```

Alternatively, you can add the no\_empty option to the X-Options HTTP header (separate options with ,).

## Flat mode {#flat-mode-1}

In the default mode the API response can include some resources multiple times, if they appear as nested resources at different levels and/or under different containing resources. Each copy of such resource certainly makes the response message slightly bigger.

The special "flat" mode can be used to optimize the response message and, sometimes, to reduce its size by deliverying related resources separately under the special resources field of the response object.

This mode can be activated by the \_flat argument:

```

?_flat=true

```

Alternatively, you can use the X-Options HTTP header with the flat option (separated by , from other ones, if any).

Here is an example of the API response in the "flat" mode:

```

{
    "status": 200,
    "
data": {
        "id": 1,
        "name": "Test 1",
        "session_id": "OK8tYiWqIbWGDTK93GX2gnNpUQzLA9c013929a217d98f4d1bc1aa751676f05b9b072f46ZWMLEH0fH76NWlmQuhzCxCKfqnff",
        "authentication_scheme": "BASIC",
        "is_base_installed": true,
        "
user": {
            "id": 1,
            "resource_type": "user"
        },
        "is_odd": true,
        "generation_time": 0.000134,
        "resource_type": "test",
        "resource_url": "https://brewfictus.kayako.com/api/v1/tests/1"
    },
    "resource": "test",
    "
resources": {
        "
role": {
            "
1": {
                "id": 1,
                "title": "Agent",
                "type": "AGENT",
                "created_at": "2015-07-21T04:30:13+05:00",
                "updated_at": "2015-07-21T04:30:13+05:00",
                "resource_type": "role",
                "resource_url": "https://brewfictus.kayako.com/api/v1/roles/1"
            }
        },
        "
identity_domain": {
            "
5": {
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
        "
organization": {
            "
7": {
                "id": 7,
                "name": "Brewfictus",
                "is_shared": false,
                "
domains": [
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
        "
business_hour": {
            "
1": {
                "id": 1,
                "title": "US office hours",
                "
zones": {
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
        "
team": {
            "
1": {
                "id": 1,
                "title": "Growth",
                "
businesshour": {
                    "id": 1,
                    "resource_type": "business_hour"
                },
                "created_at": "2015-07-21T04:30:13+05:00",
                "updated_at": "2015-07-21T04:30:13+05:00",
                "resource_type": "team",
                "resource_url": "https://brewfictus.kayako.com/api/v1/teams/1"
            }
        },
        "
identity_email": {
            "
1": {
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
        "
user": {
            "
1": {
                "id": 1,
                "full_name": "Charlotte Küchler",
                "designation": "Community Manager",
                "is_enabled": true,
                "
role": {
                    "id": 1,
                    "resource_type": "role"
                },
                "avatar": "https://brewfictus.kayako.com/avatar/get/aed21e-7619-5cb3-bbae-983015d3a",
                "agent_case_access": "ALL",
                "organization_case_access": null,
                "
organization": {
                    "id": 7,
                    "resource_type": "organization"
                },
                "
teams": [
                    {
                        "id": 1,
                        "resource_type": "team"
                    }
                ],
                "
emails": [
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

# Using Javascript {#using-javascript}

The obstacle of using the API with JavaScript is the [same-origin security policy](https://en.wikipedia.org/wiki/Same-origin_policy), that can make this usage scenario very troublesome.

The API service supports two techniques, that can make JavaScript work with the API on different domains.

## CORS (Cross-Origin Resource Sharing) {#cors-(cross-origin-resource-sharing)}

[CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) is a special protocol, which works over HTTP, that allows JavaScript and the API service to negotiate, whether the API request should be permitted or restricted.

The preflight mode of CORS is also supported by the API service.

To allow API requests from a specific domain, you need to add it to the the list of allowed domains using the Kayako UI.

The CORS interaction is handled by the web browser and the API service automatically, what means that you usually do not need to worry about technical details.

But, you can read more about CORS [here](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing).

## JSONP (JSON with Padding) {#jsonp-(json-with-padding)}

Important: Consider using CORS instead.

[JSONP](https://en.wikipedia.org/wiki/JSONP) is actually a hack, that allows to make an API request from JavaScript to another domain.

JSONP can be enabled by the \_jsonp\_callback argument, e.g.:

```

?_jsonp_callback=callbackName

```

Here, the callbackName is the name of an existing JavaScript function, that will handle the API response.

JSONP requests can use only the GET HTTP method.

Also, JSONP does not work with HTTP status codes other than **200** (OK) (or **201** (Created)). That's why the status code of JSONP API responses is always **200** (OK). Therefore, in such cases you need to check the status field of the API response for the proper HTTP status code (see also [Response](https://developer.kayako.com/api/v1/reference/response/)).

You can read more about JSONP [here](https://en.wikipedia.org/wiki/JSONP).

## 

## 

## CASES

# Activities

## Resource Fields

| Name | Type | Read-only | Description |
| :---- | :---- | :---: | :---- |
| activity | string |  | *An identifier for the activity*. create\_case, update\_case etc. Should contain a-Z and underscore. |
| actor | [Actor](https://developer.kayako.com/api/v1/cases/activities/#actor) |  | *Who did it*. The user/system that carried out this activity |
| verb | string |  | *What they did*. Create, Share, Join, Like, Notify etc. |
| summary | string |  |  |
| actions | [Actions](https://developer.kayako.com/api/v1/cases/activities/#actions) |  |  |
| object | [Object](https://developer.kayako.com/api/v1/cases/activities/#object) |  | *Activity performed on*. Conversation, Team, Event etc. |
| object\_actor | [Actor](https://developer.kayako.com/api/v1/cases/activities/#actor) |  | If this activity's object is itself another activity, this property specifies the original activity's actor |
| location | [Location](https://developer.kayako.com/api/v1/cases/activities/#location) |  |  |
| place | [Place](https://developer.kayako.com/api/v1/cases/activities/#place) |  | Where the activity was carried out |
| target | [Target](https://developer.kayako.com/api/v1/cases/activities/#target) |  | Describes object targetted by activity |
| result | [Result](https://developer.kayako.com/api/v1/cases/activities/#result) |  | Describes the result of the activity |
| in\_reply\_to | [InReplyTo](https://developer.kayako.com/api/v1/cases/activities/#inreplyto) |  | Identifying an object which can be considered as a response to the base object |
| participant | [Participant](https://developer.kayako.com/api/v1/cases/activities/#participant) |  |  |
| portal | string |  |  |
| weight | float |  | Weight decides the priority/importance of this activity |
| ip\_address | string |  |  |
| created\_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Actions

### **RESOURCE FIELDS**

| Name | Type | Read-only | Description |
| :---- | :---- | :---: | :---- |
| action | string |  | CREATED, UPDATED, DELETED |
| field | string |  |  |
| old\_value | string |  |  |
| new\_value | string |  |  |
| old\_object | Resource |  |  |
| new\_object | Resource |  |  |

## Actor

### **RESOURCE FIELDS**

| Name | Type | Read-only | Description |
| :---- | :---- | :---: | :---- |
| name | string |  |  |
| titile | string |  |  |
| prefix | string |  |  |
| url | string |  |  |
| full\_title | string |  |  |
| image | string |  |  |
| preposition | string |  |  |
| original | Resource |  |  |

## Object

### **RESOURCE FIELDS**

| Name | Type | Read-only | Description |
| :---- | :---- | :---: | :---- |
| name | string |  |  |
| titile | string |  |  |
| prefix | string |  |  |
| url | string |  |  |
| full\_title | string |  |  |
| image | string |  |  |
| preposition | string |  |  |
| original | Resource |  |  |

## Place

### **RESOURCE FIELDS**

| Name | Type | Read-only | Description |
| :---- | :---- | :---: | :---- |
| name | string |  |  |
| titile | string |  |  |
| prefix | string |  |  |
| url | string |  |  |
| full\_title | string |  |  |
| image | string |  |  |
| preposition | string |  |  |
| original | Resource |  |  |

## Target

### **RESOURCE FIELDS**

| Name | Type | Read-only | Description |
| :---- | :---- | :---: | :---- |
| name | string |  |  |
| titile | string |  |  |
| prefix | string |  |  |
| url | string |  |  |
| full\_title | string |  |  |
| image | string |  |  |
| preposition | string |  |  |
| original | Resource |  |  |

## Result

### **RESOURCE FIELDS**

| Name | Type | Read-only | Description |
| :---- | :---- | :---: | :---- |
| name | string |  |  |
| titile | string |  |  |
| prefix | string |  |  |
| url | string |  |  |
| full\_title | string |  |  |
| image | string |  |  |
| preposition | string |  |  |
| original | Resource |  |  |

## InReplyTo

### **RESOURCE FIELDS**

| Name | Type | Read-only | Description |
| :---- | :---- | :---: | :---- |
| name | string |  |  |
| titile | string |  |  |
| prefix | string |  |  |
| url | string |  |  |
| full\_title | string |  |  |
| image | string |  |  |
| preposition | string |  |  |
| original | Resource |  |  |

## Participant

### **RESOURCE FIELDS**

| Name | Type | Read-only | Description |
| :---- | :---- | :---: | :---- |
| name | string |  |  |
| titile | string |  |  |
| prefix | string |  |  |
| url | string |  |  |
| full\_title | string |  |  |
| image | string |  |  |
| preposition | string |  |  |
| original | Resource |  |  |

## Location

### **RESOURCE FIELDS**

| Name | Type | Read-only | Description |
| :---- | :---- | :---: | :---- |
| city | string |  |  |
| region | string |  |  |
| region\_code | string |  |  |
| area\_code | string |  |  |
| time\_zone | string |  |  |
| organization | string |  |  |
| net\_speed | string |  | The network speed associated with the IP address. |
| country | string |  |  |
| country\_code | string |  |  |
| postal\_code | string |  |  |
| latitude | string |  |  |
| longitude | string |  |  |
| metro\_code | string |  | The metro code associated with the IP address. These are only available for IP addresses in the US. |
| isp | string |  | The name of the Internet Service Provider associated with the IP address. |



## Metadata

  

| Version | 1.0 |
| :---- | :---- |
| Last Updated | January 13, 2017 |

## Actions

## Retrieve activities

**GET** **/api/v1/cases/:id/activities.json**

### **Information**

| Allowed for | Collaborators, Agents, Admins & Owners |
| :---- | :---- |
| Scope | [conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1) |
| Ordered by | created\_at (ascending) |

### **Arguments**

| Name | Type | Mandatory | Description |
| :---- | :---- | :---: | :---- |
| minimum\_weight | float |  | Filter activities by their minimum weight |
| since | timestamp |  | Filter activities newer than specified date |
| until | timestamp |  | Filter activities older than specified date |
| sort\_order | string |  | ASC, DESC  **Default:** DESC |

### **Response**

```

{
    "status": 200,
    "
data": [
        {
            "id": 12,
            "activity": "create_case",
            "
actor": {
                "name": "user",
                "title": "Simon Blackhouse",
                "prefix": "@",
                "url": "https://brewfictus.kayako.com/user/1",
                "full_title": "Simon Blackhouse",
                "image": "",
                "preposition": null,
                "
original": {
                    "id": 1,
                    "resource_type": "user"
                },
                "resource_type": "activity_actor"
            },
            "verb": "create",
            "summary": "<@https://brewfictus.kayako.com/user/1|Phoebe Todd> created <https://brewfictus.kayako.com/case/view/1|Atmosphere Coffee, Inc annual maintenance>",
            "actions": [],
            "
object": {
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

# Cases

## Resource Fields

| Name | Type | Read-only | Description |
| :---- | :---- | :---: | :---- |
| legacy\_id | string |  |  |
| subject | string |  |  |
| portal | string |  |  |
| source\_channel | [Channel](https://developer.kayako.com/api/v1/cases/cases/#Channels) |  | Channel represents the source from which conversation was originally created. MAIL, HELPCENTER, TWITTER, MESSENGER, FACEBOOK, NOTE |
| last\_public\_channel | [Channel](https://developer.kayako.com/api/v1/cases/cases/#Channels) |  | Channel represents the last public channel used in conversation reply. MAIL, HELPCENTER, TWITTER, FACEBOOK |
| requester | [User](https://developer.kayako.com/api/v1/users/users/) |  |  |
| creator | [User](https://developer.kayako.com/api/v1/users/users/) |  |  |
| identity | [Identity](https://developer.kayako.com/api/v1/users/identities/) |  | TWITTER, FACEBOOK, MAIL, PHONE |
| assignee | [User](https://developer.kayako.com/api/v1/users/users/) |  |  |
| assigned\_agent | [User](https://developer.kayako.com/api/v1/users/users/) |  |  |
| assigned\_team | [Team](https://developer.kayako.com/api/v1/users/teams/) |  |  |
| last\_assigned\_by | [User](https://developer.kayako.com/api/v1/users/users/) |  |  |
| brand | [Brand](https://developer.kayako.com/api/v1/general/brands/) |  |  |
| status | [Status](https://developer.kayako.com/api/v1/cases/statuses/) |  |  |
| priority | [Priority](https://developer.kayako.com/api/v1/cases/priorities/) |  |  |
| type | [Type](https://developer.kayako.com/api/v1/cases/types/) |  |  |
| read\_marker | [Read marker](https://developer.kayako.com/api/v1/cases/cases/#read-marker) |  |  |
| sla\_version | [SLA Version](https://developer.kayako.com/api/v1/cases/#sla-version/) |  |  |
| sla\_metrics | [SLA Metrics](https://developer.kayako.com/api/v1/cases/cases/#sla-metrics) |  |  |
| form | [Form](https://developer.kayako.com/api/v1/cases/forms/) |  |  |
| custom\_fields | Custom Fields |  |  |
| last\_replier | [User](https://developer.kayako.com/api/v1/users/users/) |  |  |
| last\_replier\_identity | [Identity](https://developer.kayako.com/api/v1/users/identities/) |  |  |
| last\_completed\_by | [User](https://developer.kayako.com/api/v1/users/users/) |  |  |
| last\_updated\_by | [User](https://developer.kayako.com/api/v1/users/users/) |  |  |
| last\_closed\_by | [User](https://developer.kayako.com/api/v1/users/users/) |  |  |
| state | string |  | ACTIVE, SUSPENDED, TRASH |
| post\_count | integer |  |  |
| has\_notes | boolean |  |  |
| pinned\_notes\_count | integer |  |  |
| has\_attachments | boolean |  |  |
| is\_merged | boolean |  |  |
| rating | string |  | GOOD, BAD |
| rating\_status | string |  | UNOFFERED, OFFERED, RECEIVED |
| tags | [Tag](https://developer.kayako.com/api/v1/cases/tags/) |  | Get all tags on the conversation. This field is optional and is only returned if parameter fields is passed with value \+tags. Check [here](https://developer.kayako.com/api/v1/reference/partial_output/) for more info. |
| reply\_channels | [Channel](https://developer.kayako.com/api/v1/cases/cases/api/v1/cases/cases/#Channels) |  | Get all available channels to reply on a conversation. This field is optional and is only returned if parameter fields is passed with value \+reply\_channels. Check [here](https://developer.kayako.com/api/v1/reference/partial_output/) for more info. |
| last\_post\_status | string |  | SENT, DELIVERED, REJECTED, SEEN  **Note:** *last\_post\_status* might be empty where not applicable. |
| last\_post\_preview | string |  | Preview text of last post on this conversation |
| last\_post\_type | string |  | PUBLIC, NOTE |
| last\_message\_preview | string |  | **This field will be removed very soon. Please use last\_post\_preview for preview text of last post.** |
| realtime\_channel | string |  | Subscribe to this channel for realtime updates |
| last\_assigned\_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| last\_replied\_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| last\_opened\_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| last\_pending\_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| last\_closed\_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| last\_completed\_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| last\_agent\_activity\_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| last\_customer\_activity\_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| last\_reply\_by\_agent\_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| last\_reply\_by\_requester\_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| latest\_assignee\_update | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| agent\_updated\_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| created\_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated\_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## SLA Version

| Name | Type | Read-only | Description |
| :---- | :---- | :---: | :---- |
| id | integer |  |  |
| title | string |  |  |
| description | string |  |  |
| filters | json |  |  |
| metrics | json |  | Metrics defined with the SLA Version |
| created\_at | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |  |  |

## SLA Metric

| Name | Type | Read-only | Description |
| :---- | :---- | :---: | :---- |
| metric\_type | string |  | FIRST\_REPLY\_TIME, NEXT\_REPLY\_TIME, RESOLUTION\_TIME |
| stage | string |  | ACTIVE, PAUSED, COMPLETED |
| is\_breached | boolean |  |  |
| due\_at | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |  |  |
| started\_at | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |  |  |
| completed\_at | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |  |  |
| last\_paused\_at | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |  |  |
| target | [Target](https://developer.kayako.com/api/v1/cases/service_level_agreements/#targets) |  |  |

## Read marker

| Name | Type | Read-only | Description |
| :---- | :---- | :---: | :---- |
| id | integer |  |  |
| last\_read\_post\_id | integer |  |  |
| last\_read\_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| unread\_count | integer |  |  |



## Metadata

  

| Version | 1.0 |
| :---- | :---- |
| Last Updated | January 13, 2017 |

## Actions

## Retrieve all cases

**GET** **/api/v1/cases.json**

### **Information**

| Allowed for | Collaborators, Agents, Admins & Owners |
| :---- | :---- |
| Scope | [conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1) |
| Ordered by | updated\_at (descending) |

### **Arguments**

| Name | Type | Mandatory | Description |
| :---- | :---- | :---: | :---- |
| identity\_type | string |  | EMAIL, FACEBOOK, TWITTER, PHONE |
| identity\_value | string |  | Mandatory if identity\_type is specified. Should be set as \- email if identity\_type EMAIL, username if identity\_type FACEBOOK , screenname if identity\_type TWITTER , phone number if identity\_type PHONE |
| tags | string |  | Filter conversations based on comma separated tags |
| status | string |  | NEW, OPEN, PENDING, COMPLETED, CLOSED, CUSTOM  This argument supports usage of comma separated values |
| priority | integer |  | Include all conversations having priority level less than or equal to provided level |
| start\_time | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

**OR**

| Name | Type | Mandatory | Description |
| :---- | :---- | :---: | :---- |
| ids | string |  | For retrieving conversations by ids, pass comma separated ids |

**OR**

| Name | Type | Mandatory | Description |
| :---- | :---- | :---: | :---- |
| legacy\_ids | string |  | The comma separated legacy ids |

### **Response**

```

{
    "status": 200,
    "
data": [
        {
            "id": 1,
            "legacy_id": "YAK-923-46434",
            "subject": "Atmosphere Coffee, Inc annual maintenance",
            "portal": "API",
            "
source_channel": {
                "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
                "resource_type": "channel"
            },
            "
last_public_channel": {
                "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
                "resource_type": "channel"
            },
            "
requester": {
                "id": 2,
                "resource_type": "user"
            },
            "
creator": {
                "id": 1,
                "resource_type": "user"
            },
            "
identity": {
                "id": 1,
                "resource_type": "identity_email"
            },
            "
assigned_agent": {
                "id": 1,
                "resource_type": "user"
            },
            "
assigned_team": {
                "id": 1,
                "legacy_id": null,
                "resource_type": "team"
            },
            "
last_assigned_by": {
                "id": 1,
                "resource_type": "user"
            },
            "
brand": {
                "id": 1,
                "resource_type": "brand"
            },
            "
status": {
                "id": 1,
                "resource_type": "case_status"
            },
            "
priority": {
                "id": 3,
                "resource_type": "case_priority"
            },
            "
type": {
                "id": 1,
                "resource_type": "case_type"
            },
            "
read_marker": {
                "id": 1,
                "resource_type": "read_marker"
            },
            "
sla_version": {
                "id": 1,
                "resource_type": "sla_version"
            },
            "
sla_metrics": [
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
            "
form": {
                "id": 1,
                "resource_type": "case_form"
            },
            "
custom_fields": [
                {
                    "
field": {
                        "id": 1,
                        "resource_type": "case_field"
                    },
                    "value": "3",
                    "resource_type": "case_field_value"
                }
            ],
            "
last_replier": {
                "id": 1,
                "resource_type": "user"
            },
            "
last_replier_identity": {
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

**GET** **/api/v1/organizations/:id/cases.json**

### **Information**

| Allowed for | Collaborators, Agents, Admins & Owners |
| :---- | :---- |
| Scope | [conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1) |
| Ordered by | updated\_at (descending) |

### **Request Parameters**

| Name | Type | Mandatory | Description |
| :---- | :---- | :---: | :---- |
| status | string |  | NEW, OPEN, PENDING, COMPLETED, CLOSED, CUSTOM  This argument supports usage of comma separated values |
| priority | integer |  | Include all conversations having priority level less than or equal to provided level |

### **Response**

```

{
    "status": 200,
    "
data": [
        {
            "id": 1,
            "legacy_id": "YAK-923-46434",
            "subject": "Atmosphere Coffee, Inc annual maintenance",
            "portal": "API",
            "
source_channel": {
                "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
                "resource_type": "channel"
            },
            "
last_public_channel": {
                "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
                "resource_type": "channel"
            },
            "
requester": {
                "id": 2,
                "resource_type": "user"
            },
            "
creator": {
                "id": 1,
                "resource_type": "user"
            },
            "
identity": {
                "id": 1,
                "resource_type": "identity_email"
            },
            "
assigned_agent": {
                "id": 1,
                "resource_type": "user"
            },
            "
assigned_team": {
                "id": 1,
                "legacy_id": null,
                "resource_type": "team"
            },
            "
last_assigned_by": {
                "id": 1,
                "resource_type": "user"
            },
            "
brand": {
                "id": 1,
                "resource_type": "brand"
            },
            "
status": {
                "id": 1,
                "resource_type": "case_status"
            },
            "
priority": {
                "id": 3,
                "resource_type": "case_priority"
            },
            "
type": {
                "id": 1,
                "resource_type": "case_type"
            },
            "
read_marker": {
                "id": 1,
                "resource_type": "read_marker"
            },
            "
sla_version": {
                "id": 1,
                "resource_type": "sla_version"
            },
            "
sla_metrics": [
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
            "
form": {
                "id": 1,
                "resource_type": "case_form"
            },
            "
custom_fields": [
                {
                    "
field": {
                        "id": 1,
                        "resource_type": "case_field"
                    },
                    "value": "3",
                    "resource_type": "case_field_value"
                }
            ],
            "
last_replier": {
                "id": 1,
                "resource_type": "user"
            },
            "
last_replier_identity": {
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

**GET** **/api/v1/cases/:id.json**

### **Information**

| Allowed for | Collaborators, Agents, Admins & Owners |
| :---- | :---- |
| Scope | [conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1) |

### **Response**

```

{
    "status": 200,
    "
data": {
        "id": 1,
        "legacy_id": "YAK-923-46434",
        "subject": "Atmosphere Coffee, Inc annual maintenance",
        "portal": "API",
        "
source_channel": {
            "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
            "resource_type": "channel"
        },
        "
last_public_channel": {
            "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
            "resource_type": "channel"
        },
        "
requester": {
            "id": 2,
            "resource_type": "user"
        },
        "
creator": {
            "id": 1,
            "resource_type": "user"
        },
        "
identity": {
            "id": 1,
            "resource_type": "identity_email"
        },
        "
assigned_agent": {
            "id": 1,
            "resource_type": "user"
        },
        "
assigned_team": {
            "id": 1,
            "legacy_id": null,
            "resource_type": "team"
        },
        "
last_assigned_by": {
            "id": 1,
            "resource_type": "user"
        },
        "
brand": {
            "id": 1,
            "resource_type": "brand"
        },
        "
status": {
            "id": 1,
            "resource_type": "case_status"
        },
        "
priority": {
            "id": 3,
            "resource_type": "case_priority"
        },
        "
type": {
            "id": 1,
            "resource_type": "case_type"
        },
        "
read_marker": {
            "id": 1,
            "resource_type": "read_marker"
        },
        "
sla_version": {
            "id": 1,
            "resource_type": "sla_version"
        },
        "
sla_metrics": [
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
        "
form": {
            "id": 1,
            "resource_type": "case_form"
        },
        "
custom_fields": [
            {
                "
field": {
                    "id": 1,
                    "resource_type": "case_field"
                },
                "value": "3",
                "resource_type": "case_field_value"
            }
        ],
        "
last_replier": {
            "id": 1,
            "resource_type": "user"
        },
        "
last_replier_identity": {
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

### **RESOURCE FIELDS**

| Name | Type | Read-only | Description |
| :---- | :---- | :---: | :---- |
| uuid | string |  |  |
| type | string |  | HELPCENTER, MAIL, FACEBOOK, TWITTER, MESSENGER, NOTE |
| character\_limit | integer |  |  |
| account | Resource |  |  |

## Retrieve for new conversation

**GET** **/api/v1/cases/channels.json**

### **Information**

| Allowed for | Collaborators, Agents, Admins & Owners |
| :---- | :---- |
| Scope | [conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1) |

### **Arguments**

| Name | Type | Mandatory | Description |
| :---- | :---- | :---: | :---- |
| user\_id | integer |  | Conversation requester id |

### **Response**

```

{
    "status": 200,
    "
data": [
        {
            "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
            "type": "MAIL",
            "character_limit": null,
            "
account": {
                "id": 1,
                "resource_type": "mailbox"
            },
            "resource_type": "channel"
        },
        {
            "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
            "type": "FACEBOOK",
            "character_limit": null,
            "
account": {
                "id": "876423285750729",
                "resource_type": "facebook_page"
            },
            "resource_type": "channel"
        },
        {
            "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
            "type": "TWITTER",
            "character_limit": 127,
            "
account": {
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

**GET** **/api/v1/cases/:id/reply/channels.json**

### **Information**

| Allowed for | Collaborators, Agents, Admins & Owners |
| :---- | :---- |
| Scope | [conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1) |

### **Response**

```

{
    "status": 200,
    "
data": [
        {
            "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
            "type": "MAIL",
            "character_limit": null,
            "
account": {
                "id": 1,
                "resource_type": "mailbox"
            },
            "resource_type": "channel"
        },
        {
            "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
            "type": "TWITTER",
            "character_limit": 127,
            "
account": {
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

**GET** **/api/v1/cases/:id/channels.json**

### **Information**

| Allowed for | Collaborators, Agents, Admins & Owners |
| :---- | :---- |
| Scope | [conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1) |

### **Response**

```

{
    "status": 200,
    "
data": [
        {
            "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
            "type": "MAIL",
            "character_limit": null,
            "
account": {
                "id": 1,
                "resource_type": "mailbox"
            },
            "resource_type": "channel"
        },
        {
            "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
            "type": "FACEBOOK",
            "character_limit": null,
            "
account": {
                "id": "876423285750729",
                "resource_type": "facebook_page"
            },
            "resource_type": "channel"
        },
        {
            "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
            "type": "TWITTER",
            "character_limit": 127,
            "
account": {
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

**POST** **/api/v1/cases.json**

### **Information**

| Allowed for | Collaborators, Agents, Admins & Owners |
| :---- | :---- |
| Scope | [conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1) |

### **Parameters**

| Name | Type | Mandatory | Description |
| :---- | :---- | :---: | :---- |
| subject | string |  |  |
| contents | string |  |  |
| legacy\_id | string |  |  |
| requester\_id | integer |  |  |
| channel | string |  | MAIL, TWITTER, FACEBOOK, NOTE |
| channel\_id | integer |  | Not required for channel NOTE |
| channel\_options | string |  | **MAIL:**  Allowed options are *cc* and *html **cc*****:** comma separated email addresses ***html*****:** if set to true then system will parse the contents through the purify service and render them **Example:** {"cc":"ben.pigford@brewfictus.com,bekki.park@brewfictus.com", "html":true}  **TWITTER:**  Allowed options is *type **type*****:** allowed values are REPLY, DM, REPLY\_WITH\_PROMPT **Default:** REPLY  **Note:** for type REPLY\_WITH\_PROMPT please enable [Receive Direct Messages from Anyone](https://business.twitter.com/en/help/campaign-editing-and-optimization/public-to-private-conversation.html) setting for Twitter account **Example:** {"type":"REPLY\_WITH\_PROMPT"}  **NOTE:**  Allowed option is *html **html*****:** if set to true then system will parse the contents through the purify service and render them **Example:** {"html":true} |
| priority\_id | integer |  |  |
| type\_id | integer |  |  |
| assigned\_team\_id | integer |  |  |
| assigned\_agent\_id | integer |  |  |
| status\_id | integer |  |  |
| form\_id | integer |  |  |
| field\_values | array |  | This operation will add field values with requested field keys. **Format:** field\_values\[field\_key\] \= field\_value field\_values\[field\_key\] \= field\_value **For Options:** CSV options are accepted for multi-select |
| tags | string |  | Comma separated tags |
| attachment | [multipart/form-data](https://developer.kayako.com/api/v1/cases/cases/#) |  |  |
| attachment\_file\_ids | [CSV](https://developer.kayako.com/api/v1/cases/cases/#) |  |  |
| client\_id | string |  | If provided, this value will be returned in the [Posts](https://developer.kayako.com/api/v1/cases/cases/#Posts) resource. Used to identify messages reflected back from the server. |

### **Request**

```

curl -X POST https://brewfictus.kayako.com/api/v1/cases \
     -d '{"subject":"My coffee machine is not working","contents":"Hey! I am facing issue from last week kindly look into it on priority","channel":"MAIL","channel_id":"1","requester_id":"2","priority_id":"3","type_id":"1"}' \
     -H "Content-Type: application/json" \
     -u 'jordan.mitchell@brewfictus.com:jmit6#lsXo'

```

### **Response**

```

{
    "status": 201,
    "
data": {
        "id": 1,
        "legacy_id": "YAK-923-46434",
        "subject": "Atmosphere Coffee, Inc annual maintenance",
        "portal": "API",
        "
source_channel": {
            "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
            "resource_type": "channel"
        },
        "
last_public_channel": {
            "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
            "resource_type": "channel"
        },
        "
requester": {
            "id": 2,
            "resource_type": "user"
        },
        "
creator": {
            "id": 1,
            "resource_type": "user"
        },
        "
identity": {
            "id": 1,
            "resource_type": "identity_email"
        },
        "
assigned_agent": {
            "id": 1,
            "resource_type": "user"
        },
        "
assigned_team": {
            "id": 1,
            "legacy_id": null,
            "resource_type": "team"
        },
        "
last_assigned_by": {
            "id": 1,
            "resource_type": "user"
        },
        "
brand": {
            "id": 1,
            "resource_type": "brand"
        },
        "
status": {
            "id": 1,
            "resource_type": "case_status"
        },
        "
priority": {
            "id": 3,
            "resource_type": "case_priority"
        },
        "
type": {
            "id": 1,
            "resource_type": "case_type"
        },
        "
read_marker": {
            "id": 1,
            "resource_type": "read_marker"
        },
        "
sla_version": {
            "id": 1,
            "resource_type": "sla_version"
        },
        "
sla_metrics": [
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
        "
form": {
            "id": 1,
            "resource_type": "case_form"
        },
        "
custom_fields": [
            {
                "
field": {
                    "id": 1,
                    "resource_type": "case_field"
                },
                "value": "3",
                "resource_type": "case_field_value"
            }
        ],
        "
last_replier": {
            "id": 1,
            "resource_type": "user"
        },
        "
last_replier_identity": {
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

**POST** **/api/v1/bulk/cases.json**

### **Information**

| Allowed for | Agents, Admins & Owners |
| :---- | :---- |
| Scope | [conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1) |

You can insert a maximum of 200 cases at a time

### **Parameters**

| Name | Type | Mandatory | Description |
| :---- | :---- | :---: | :---- |
| cases | array |  | Array of cases to be inserted |

### **Case**

| Name | Type | Mandatory | Description |
| :---- | :---- | :---: | :---- |
| subject | string |  |  |
| contents | string |  |  |
| legacy\_id | string |  |  |
| requester\_id | integer |  |  |
| channel | string |  | MAIL, NOTE |
| channel\_id | integer |  | Not required for channel NOTE |
| channel\_options | string |  | **MAIL:**  Allowed options are *cc* and *html **cc*****:** comma separated email addresses ***html*****:** if set to true then system will parse the contents through the purify service and render them **Example:** {"cc":"ben.pigford@brewfictus.com,bekki.park@brewfictus.com", "html":true}  **TWITTER:**  Allowed options is *type **type*****:** allowed values are REPLY, DM, REPLY\_WITH\_PROMPT **Default:** REPLY  **Note:** for type REPLY\_WITH\_PROMPT please enable [Receive Direct Messages from Anyone](https://business.twitter.com/en/help/campaign-editing-and-optimization/public-to-private-conversation.html) setting for Twitter account **Example:** {"type":"REPLY\_WITH\_PROMPT"}  **NOTE:**  Allowed option is *html **html*****:** if set to true then system will parse the contents through the purify service and render them **Example:** {"html":true} |
| priority\_id | integer |  |  |
| type\_id | integer |  |  |
| assigned\_team\_id | integer |  |  |
| assigned\_agent\_id | integer |  |  |
| status\_id | integer |  |  |
| form\_id | integer |  |  |
| field\_values | array |  | This operation will add field values with requested field keys. **Format:** field\_values\[field\_key\] \= field\_value field\_values\[field\_key\] \= field\_value **For Options:** CSV options are accepted for multi-select |
| tags | string |  | Comma separated tags |
| attachment\_file\_ids | [CSV](https://developer.kayako.com/api/v1/cases/cases/#) |  |  |
| posts |  |  | Array of case posts to be inserted |
| client\_id | string |  | If provided, this value will be returned in the [Posts](https://developer.kayako.com/api/v1/cases/cases/#Posts) resource. Used to identify messages reflected back from the server. |
| created\_at | string |  | Timestamp in format YYYY-MM-DDThh:mm:ssTZD |
| updated\_at | string |  | Timestamp in format YYYY-MM-DDThh:mm:ssTZD |

### **Post**

| Name | Type | Mandatory | Description |
| :---- | :---- | :---: | :---- |
| contents | string |  |  |
| channel | string |  |  |
| channel | string |  | MAIL, NOTE |
| channel\_id | integer |  | Not required for channel NOTE |
| channel\_options | string |  | **MAIL:**  Allowed options are *cc* and *html **cc*****:** comma separated email addresses ***html*****:** if set to true then system will parse the contents through the purify service and render them **Example:** {"cc":"ben.pigford@brewfictus.com,bekki.park@brewfictus.com", "html":true}  **TWITTER:**  Allowed options is *type **type*****:** allowed values are REPLY, DM, REPLY\_WITH\_PROMPT **Default:** REPLY  **Note:** for type REPLY\_WITH\_PROMPT please enable [Receive Direct Messages from Anyone](https://business.twitter.com/en/help/campaign-editing-and-optimization/public-to-private-conversation.html) setting for Twitter account **Example:** {"type":"REPLY\_WITH\_PROMPT"}  **NOTE:**  Allowed option is *html **html*****:** if set to true then system will parse the contents through the purify service and render them **Example:** {"html":true} |
| attachment\_file\_ids | [CSV](https://developer.kayako.com/api/v1/cases/cases/#) |  |  |
| created\_at | string |  | Timestamp in format YYYY-MM-DDThh:mm:ssTZD |
| updated\_at | string |  | Timestamp in format YYYY-MM-DDThh:mm:ssTZD |

### **Arguments**

| Name | Type | Mandatory | Description |
| :---- | :---- | :---: | :---- |
| partial\_import | boolean |  | By default, even if a single record is invalid, the entire batch is dropped. However, if this parameter is set to true, all the records with no validation errors will be inserted while the invalid records will be returned back. |

### **Request**

```

curl -X POST https://brewfictus.kayako.com/api/v1/bulk/cases \
    -d '{"cases": [{"subject": "Sample Test 1", "creator_id": 1, "contents": "Sample Content", "requester_id": 1, "channel": "MAIL", "channel_id": 1, "legacy_id": "example_5", "posts": [{"creator_id": 1, "contents": "Sample Post", "channel": "MAIL", "channel_id": 1}]}]}' \
    -H "Content-Type: application/json"

```

### **Response**

```

{
    "status": 202,
    "
data": {
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

**PUT** **/api/v1/cases/:id.json**

### **Information**

| Allowed for | Collaborators, Agents, Admins & Owners |
| :---- | :---- |
| Scope | [conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1) |

### **Parameters**

| Name | Type | Mandatory | Description |
| :---- | :---- | :---: | :---- |
| subject | string |  |  |
| requester\_id | integer |  |  |
| assigned\_team\_id | integer |  |  |
| brand\_id | integer |  |  |
| assigned\_agent\_id | integer |  |  |
| status\_id | integer |  |  |
| priority\_id | integer |  |  |
| type\_id | integer |  |  |
| form\_id | integer |  |  |
| state | string |  | TRASH |
| field\_values | array |  | This operation will add or update existing field values with requested field keys. **Format:** field\_values\[field\_key\] \= field\_value field\_values\[field\_key\] \= field\_value **For Options:** CSV options are accepted for multi-select **WARNING:** All options must be passed. The options which are not passed will be removed. |
| tags | string |  | Comma separated tags |

### **Response**

```

{
    "status": 200,
    "
data": {
        "id": 1,
        "legacy_id": "YAK-923-46434",
        "subject": "Atmosphere Coffee, Inc annual maintenance",
        "portal": "API",
        "
source_channel": {
            "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
            "resource_type": "channel"
        },
        "
last_public_channel": {
            "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
            "resource_type": "channel"
        },
        "
requester": {
            "id": 2,
            "resource_type": "user"
        },
        "
creator": {
            "id": 1,
            "resource_type": "user"
        },
        "
identity": {
            "id": 1,
            "resource_type": "identity_email"
        },
        "
assigned_agent": {
            "id": 1,
            "resource_type": "user"
        },
        "
assigned_team": {
            "id": 1,
            "legacy_id": null,
            "resource_type": "team"
        },
        "
last_assigned_by": {
            "id": 1,
            "resource_type": "user"
        },
        "
brand": {
            "id": 1,
            "resource_type": "brand"
        },
        "
status": {
            "id": 1,
            "resource_type": "case_status"
        },
        "
priority": {
            "id": 3,
            "resource_type": "case_priority"
        },
        "
type": {
            "id": 1,
            "resource_type": "case_type"
        },
        "
read_marker": {
            "id": 1,
            "resource_type": "read_marker"
        },
        "
sla_version": {
            "id": 1,
            "resource_type": "sla_version"
        },
        "
sla_metrics": [
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
        "
form": {
            "id": 1,
            "resource_type": "case_form"
        },
        "
custom_fields": [
            {
                "
field": {
                    "id": 1,
                    "resource_type": "case_field"
                },
                "value": "3",
                "resource_type": "case_field_value"
            }
        ],
        "
last_replier": {
            "id": 1,
            "resource_type": "user"
        },
        "
last_replier_identity": {
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

**PUT** **/api/v1/cases.json**

### **Information**

| Allowed for | Collaborators, Agents, Admins & Owners |
| :---- | :---- |
| Scope | [conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1) |

### **Arguments**

| Name | Type | Mandatory | Description |
| :---- | :---- | :---: | :---- |
| ids | string |  | The comma separated ids |

### **Parameters**

| Name | Type | Mandatory | Description |
| :---- | :---- | :---: | :---- |
| requester\_id | integer |  |  |
| assigned\_team\_id | integer |  |  |
| assigned\_agent\_id | integer |  |  |
| status\_id | integer |  |  |
| priority\_id | integer |  |  |
| type\_id | integer |  |  |
| state | string |  | TRASH |
| reply | string |  |  |
| notes | string |  |  |
| tags | string |  | The comma separated tags applied to these conversations |

### **Response**

```

{
    "status": 200,
    "total_count": 2
}
```

## Mark conversation as trash

**PUT** **/api/v1/cases/:id/trash.json**

### **Information**

| Allowed for | Agents, Admins & Owners |
| :---- | :---- |
| Scope | [conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1) |

### **Response**

```

{
    "status": 200,
    "
data": {
        "id": 1,
        "legacy_id": "YAK-923-46434",
        "subject": "Atmosphere Coffee, Inc annual maintenance",
        "portal": "API",
        "
source_channel": {
            "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
            "resource_type": "channel"
        },
        "
last_public_channel": {
            "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
            "resource_type": "channel"
        },
        "
requester": {
            "id": 2,
            "resource_type": "user"
        },
        "
creator": {
            "id": 1,
            "resource_type": "user"
        },
        "
identity": {
            "id": 1,
            "resource_type": "identity_email"
        },
        "
assigned_agent": {
            "id": 1,
            "resource_type": "user"
        },
        "
assigned_team": {
            "id": 1,
            "legacy_id": null,
            "resource_type": "team"
        },
        "
last_assigned_by": {
            "id": 1,
            "resource_type": "user"
        },
        "
brand": {
            "id": 1,
            "resource_type": "brand"
        },
        "
status": {
            "id": 1,
            "resource_type": "case_status"
        },
        "
priority": {
            "id": 3,
            "resource_type": "case_priority"
        },
        "
type": {
            "id": 1,
            "resource_type": "case_type"
        },
        "
read_marker": {
            "id": 1,
            "resource_type": "read_marker"
        },
        "
sla_version": {
            "id": 1,
            "resource_type": "sla_version"
        },
        "
sla_metrics": [
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
        "
form": {
            "id": 1,
            "resource_type": "case_form"
        },
        "
custom_fields": [
            {
                "
field": {
                    "id": 1,
                    "resource_type": "case_field"
                },
                "value": "3",
                "resource_type": "case_field_value"
            }
        ],
        "
last_replier": {
            "id": 1,
            "resource_type": "user"
        },
        "
last_replier_identity": {
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

**PUT** **/api/v1/cases/trash.json**

### **Information**

| Allowed for | Agents, Admins & Owners |
| :---- | :---- |
| Scope | [conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1) |

### **Arguments**

| Name | Type | Mandatory | Description |
| :---- | :---- | :---: | :---- |
| ids | string |  | The comma separated ids |

### **Response**

```

{
    "status": 200,
    "total_count": 1
}
```

## Empty trash

**DELETE** **/api/v1/cases/trash.json**

### **Information**

| Allowed for | Admins & Owners |
| :---- | :---- |

### **Response**

```

{
    "status": 200
}
```

## Restore a conversations

**PUT** **/api/v1/cases/:id/restore.json**

### **Information**

| Allowed for | Collaborators, Agents, Admins & Owners |
| :---- | :---- |
| Scope | [conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1) |

### **Response**

```

{
    "status": 200,
    "
data": {
        "id": 1,
        "legacy_id": "YAK-923-46434",
        "subject": "Atmosphere Coffee, Inc annual maintenance",
        "portal": "API",
        "
source_channel": {
            "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
            "resource_type": "channel"
        },
        "
last_public_channel": {
            "uuid": "37e31d9d-cbd4-48a2-9134-1206abefa1b4",
            "resource_type": "channel"
        },
        "
requester": {
            "id": 2,
            "resource_type": "user"
        },
        "
creator": {
            "id": 1,
            "resource_type": "user"
        },
        "
identity": {
            "id": 1,
            "resource_type": "identity_email"
        },
        "
assigned_agent": {
            "id": 1,
            "resource_type": "user"
        },
        "
assigned_team": {
            "id": 1,
            "legacy_id": null,
            "resource_type": "team"
        },
        "
last_assigned_by": {
            "id": 1,
            "resource_type": "user"
        },
        "
brand": {
            "id": 1,
            "resource_type": "brand"
        },
        "
status": {
            "id": 1,
            "resource_type": "case_status"
        },
        "
priority": {
            "id": 3,
            "resource_type": "case_priority"
        },
        "
type": {
            "id": 1,
            "resource_type": "case_type"
        },
        "
read_marker": {
            "id": 1,
            "resource_type": "read_marker"
        },
        "
sla_version": {
            "id": 1,
            "resource_type": "sla_version"
        },
        "
sla_metrics": [
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
        "
form": {
            "id": 1,
            "resource_type": "case_form"
        },
        "
custom_fields": [
            {
                "
field": {
                    "id": 1,
                    "resource_type": "case_field"
                },
                "value": "3",
                "resource_type": "case_field_value"
            }
        ],
        "
last_replier": {
            "id": 1,
            "resource_type": "user"
        },
        "
last_replier_identity": {
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

### **RESOURCE FIELDS**

| Name | Type | Read-only | Description |
| :---- | :---- | :---: | :---- |
| uuid | string |  |  |
| client\_id | string |  | client\_id is provided by the client when creating a message. Can be used to identify messages reflected from the server back to the originating entity. This value may be null if not supplied by the client. Since this is only useful for realtime communication, older values might be erased periodically. |
| subject | string |  |  |
| contents | string |  |  |
| creator | [User](https://developer.kayako.com/api/v1/users/users/) | [Trigger](https://developer.kayako.com/api/v1/automation/triggers/) | [Monitor](https://developer.kayako.com/api/v1/automation/monitors/) |  | The entity that created this post. For all user actions, this will be a user resource. If triggered by automations, it will be either a monitor or trigger resource. Might be null for actions performed by the system. |
| identity | [Identity](https://developer.kayako.com/api/v1/users/identities/) |  | For Trigger & Monitor the Identity would be null |
| source\_channel | [Channel](https://developer.kayako.com/api/v1/cases/cases/#Channels) |  | Channel represents the source from which post was originally created. MAIL, HELPCENTER, TWITTER, MESSENGER, FACEBOOK, NOTE  For activities the channel would be null |
| attachments | [Attachments](https://developer.kayako.com/api/v1/cases/cases/#attachments) |  |  |
| download\_all | string |  |  |
| destination\_medium | string |  | MAIL, MESSENGER  Applicable for agent reply via MAIL channel. This value will be null for agent reply via other channels and for customer reply |
| source | string |  | API, AGENT, MAIL, MESSENGER, MOBILE, HELPCENTER |
| metadata | array |  | Metadata will be in key \- value pair |
| original | Resource |  |  |
| post\_status | string |  | SENT, DELIVERED, REJECTED, SEEN  **Default:** SENT |
| post\_status\_reject\_type | string |  | BOUNCE, BLOCKED, DROPPED, DEFERRED, EXPIRED, ERROR  **Note:** This field applicable for REJECTED post\_status |
| post\_status\_reject\_reason | string |  | Reject reason from MTA **Note:** This field applicable for REJECTED post\_status |
| post\_status\_updated\_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| created\_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated\_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Shadow posts

### **RESOURCE FIELDS**

| Name | Type | Read-only | Description |
| :---- | :---- | :---: | :---- |
| uuid | string |  |  |
| subject | string |  |  |
| contents | string |  |  |
| creator | [User](https://developer.kayako.com/api/v1/users/users/) |  | Original post creator (agent/customer) |
| identity | [Identity](https://developer.kayako.com/api/v1/users/identities/) |  | Original post creator identity |
| original\_post | Resource |  |  |
| created\_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Attachments

### **RESOURCE FIELDS**

| Name | Type | Read-only | Description |
| :---- | :---- | :---: | :---- |
| name | string |  |  |
| size | integer |  |  |
| width | integer |  | Only if the attachment is image |
| height | integer |  | Only if the attachment is image |
| type | string |  | Mime-type of the file |
| content\_id | string |  | Content ID used for inline attachment |
| alt | string |  |  |
| url | string |  | The URL to view the attachment |
| url\_download | string |  | The URL to download the attachment |
| thumbnails | [Thumbnails](https://developer.kayako.com/api/v1/cases/cases/#thumbnails) |  |  |
| created\_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Thumbnails

### **RESOURCE FIELDS**

| Name | Type | Read-only | Description |
| :---- | :---- | :---: | :---- |
| name | string |  |  |
| size | integer |  |  |
| width | integer |  |  |
| height | integer |  |  |
| type | string |  | Mime-type of the file |
| url | string |  | The URL to view the thumbnail |
| created\_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Email Original

### **RESOURCE FIELDS**

| Name | Type | Read-only | Description |
| :---- | :---- | :---: | :---- |
| id | integer |  |  |
| subject | string |  |  |
| from | string |  |  |
| to | string |  |  |
| received\_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| html\_content | string |  | The original html associated with the mail |
| striped\_html | string |  | The html associated with the mail with quoted text striped out |
| source\_content | string |  | Associated headers with the mail |

## Retrieve conversation posts

**GET** **/api/v1/cases/:id/posts.json**

### **Information**

| Allowed for | Collaborators, Agents, Admins & Owners |
| :---- | :---- |
| Scope | [conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1) |
| Ordered by | id (descending) |

### **Arguments**

| Name | Type | Mandatory | Description |
| :---- | :---- | :---: | :---- |
| after\_id | integer |  |  |
| before\_id | integer |  |  |
| filters | string |  | Filter posts based on ALL, ACTIVITIES, MESSAGES, NOTES, SHADOW\_POSTS, CHAT\_MESSAGES, FACEBOOK\_POSTS, FACEBOOK\_POST\_COMMENTS, FACEBOOK\_MESSAGES, TWEETS, TWITTER\_MESSAGES |

By default posts will be returned without activities. To retrieve posts with activities use ALL.

At a time either after\_id or before\_id is allowed.

### **Response**

```

{
    "status": 200,
    "
data": [
        {
            "id": 1,
            "uuid": "0da0b7df-9528-4e76-af3e-b7419c61f400",
            "client_id": "93a236f0-edac-4b5a-8747-14140da7d4dc",
            "subject": "Customer is using Honey - Blend. So communicate accordingly",
            "contents": "Customer is using Honey - Blend. So communicate accordingly",
            "
creator": {
                "id": 1,
                "resource_type": "user"
            },
            "identity": null,
            "source_channel": null,
            "attachments": [],
            "download_all": null,
            "destination_medium": "MESSENGER",
            "source": "MAIL",
            "
metadata": {
                "user_agent": "Chrome",
                "page_url": ""
            },
            "
original": {
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

**GET** **/api/v1/cases/posts/:id.json**

### **Information**

| Allowed for | Collaborators, Agents, Admins & Owners |
| :---- | :---- |
| Scope | [conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1) |

### **Response**

```

{
    "status": 200,
    "
data": {
        "id": 1,
        "uuid": "0da0b7df-9528-4e76-af3e-b7419c61f400",
        "client_id": "93a236f0-edac-4b5a-8747-14140da7d4dc",
        "subject": "Customer is using Honey - Blend. So communicate accordingly",
        "contents": "Customer is using Honey - Blend. So communicate accordingly",
        "
creator": {
            "id": 1,
            "resource_type": "user"
        },
        "identity": null,
        "source_channel": null,
        "attachments": [],
        "download_all": null,
        "destination_medium": "MESSENGER",
        "source": "MAIL",
        "
metadata": {
            "user_agent": "Chrome",
            "page_url": ""
        },
        "
original": {
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

**GET** **/api/v1/cases/posts/:id/email\_original.json**

### **Information**

| Allowed for | Collaborators, Agents, Admins & Owners |
| :---- | :---- |
| Scope | [conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1) |

### **Response**

```

{
    "status": 200,
    "
data": {
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

**PUT** **/api/v1/cases/posts/:id.json**

### **Information**

| Allowed for | Collaborators, Agents, Admins & Owners |
| :---- | :---- |
| Scope | [conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1) |

### **Parameters**

| Name | Type | Mandatory | Description |
| :---- | :---- | :---: | :---- |
| post\_status | string |  | Allowed values are DELIVERED, SEEN  When a post is marked as SEEN, all preceding posts are also set as SEEN. Therefore, to update the *post\_status* of all visible posts, perform a single request using the last visible post's id. |

### **Response**

```

{
    "status": 200
}
```

## Reply

### **RESOURCE FIELDS**

| Name | Type | Read-only | Description |
| :---- | :---- | :---: | :---- |
| posts | Resources |  |  |
| case | [Case](https://developer.kayako.com/api/v1/cases/cases/#resource-fields) |  |  |

## Add a reply

**POST** **/api/v1/cases/:id/reply.json**

### **Information**

| Allowed for | Collaborators, Agents, Admins & Owners |
| :---- | :---- |
| Scope | [conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1) |

### **Parameters**

| Name | Type | Mandatory | Description |
| :---- | :---- | :---: | :---- |
| contents | string |  |  |
| channel | string |  | MAIL, TWITTER, FACEBOOK, NOTE |
| channel\_id | integer |  | Not required for channel NOTE |
| channel\_options | string |  | **MAIL:**  Allowed options are *cc **cc*****:** comma separated email addresses **Example:** {"cc":"ben.pigford@brewfictus.com,bekki.park@brewfictus.com"}  **TWITTER:**  Allowed options is *type **type*****:** allowed values are REPLY, DM, REPLY\_WITH\_PROMPT **Default:** REPLY  **Note:** for type REPLY\_WITH\_PROMPT please enable [Receive Direct Messages from Anyone](https://business.twitter.com/en/help/campaign-editing-and-optimization/public-to-private-conversation.html) setting for Twitter account **Example:** {"type":"REPLY\_WITH\_PROMPT"}  **NOTE:**  Allowed option is *html **html*****:** if set to true then system will parse the contents through the purify service and render them **Example:** {"html":true} |
| subject | string |  | Change the subject of the conversation |
| requester\_id | integer |  |  |
| status\_id | integer |  |  |
| priority\_id | integer |  |  |
| type\_id | integer |  |  |
| assigned\_team\_id | integer |  |  |
| assigned\_agent\_id | integer |  |  |
| tags | string |  | The comma separated tags |
| form\_id | integer |  |  |
| source | string |  | MAIL, MESSENGER, AGENT, API, MOBILE |
| metadata | array |  | We accept the metadata in key \- value pair **Example:** {"user\_agent":"Chrome"} ***Note*****:** Currently we only support user\_agent, can be used to set user-friendly names like Chrome, Firefox etc |
| field\_values | array |  | This operation will add or update existing field values with requested field keys. **Format:** field\_values\[field\_key\] \= field\_value field\_values\[field\_key\] \= field\_value **For Options:** CSV options are accepted for multi-select **WARNING:** All options must be passed. The options which are not passed will be removed. |
| attachment | [multipart/form-data](https://developer.kayako.com/api/v1/cases/cases/#) |  |  |
| attachment\_file\_ids | string |  | Comma-separated list of file IDs. Files can be uploaded via the [Add a file endpoint](https://developer.kayako.com/api/v1/general/files/#Add-a-file) |
| client\_id | string |  | If provided, this value will be returned in the [Posts](https://developer.kayako.com/api/v1/cases/cases/#Posts) resource. Used to identify messages reflected back from the server. |

### **Response**

```

{
    "status": 201,
    "
data": {
        "
posts": [
            {
                "id": 1,
                "resource_type": "post"
            }
        ],
        "
case": {
            "id": 1,
            "resource_type": "case"
        },
        "resource_type": "case_reply"
    },
    "resource": "case_reply"
}
```

# Fields

## Resource Fields

| Name | Type | Read-only | Description |
| :---- | :---- | :---: | :---- |
| fielduuid | string |  | The fielduuid is unique to this field |
| title | string |  |  |
| type | string |  | **System Field Types: SUBJECT, MESSAGE, PRIORITY, STATUS, TYPE, TEAM, ASSIGNEE  Custom Field Types: TEXT, TEXTAREA, CHECKBOX, RADIO, SELECT, DATE, FILE, NUMERIC, DECIMAL, YESNO, CASCADINGSELECT, REGEX** |
| key | string |  | The key is unique to this field |
| is\_required\_for\_agents | boolean |  | **Default:** false |
| is\_required\_on\_resolution | boolean |  | **Default:** false |
| is\_visible\_to\_customers | boolean |  | **Default:** false |
| customer\_titles | [Field Locales](https://developer.kayako.com/api/v1/general/field_locales/) |  |  |
| is\_customer\_editable | boolean |  | **Default:** false |
| is\_required\_for\_customers | boolean |  | **Default:** false |
| descriptions | [Field Locales](https://developer.kayako.com/api/v1/general/field_locales/) |  |  |
| regular\_expression | string |  |  |
| sort\_order | integer |  |  |
| is\_enabled | boolean |  |  |
| is\_system | boolean |  |  |
| options | [Options](https://developer.kayako.com/api/v1/cases/fields#Options) |  |  |
| created\_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated\_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |



## Metadata

  

| Version | 1.0 |
| :---- | :---- |
| Last Updated | January 13, 2017 |

## Actions

## Retrieve all fields

**GET** **/api/v1/cases/fields.json**

### **Information**

| Allowed for | Collaborators, Agents, Admins & Owners |
| :---- | :---- |
| Scope | [conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1) |
| Ordered by | sort\_order (ascending) |

Collaborators and Agents can only see the enabled fields.

### **Response**

```

{
    "status": 200,
    "
data": [
        {
            "id": 1,
            "fielduuid": "dbc6a83d-5374-42ef-9ccc-c518232ca46d",
            "title": "Serial number",
            "type": "TEXT",
            "key": "serial_number",
            "is_required_for_agents": false,
            "is_required_on_resolution": false,
            "is_visible_to_customers": true,
            "
customer_titles": [
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

**GET** **/api/v1/cases/fields/:id.json**

### **Information**

| Allowed for | Collaborators, Agents, Admins & Owners |
| :---- | :---- |
| Scope | [conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1) |

Collaborators and Agents can only see the enabled field.

### **Response**

```

{
    "status": 200,
    "
data": {
        "id": 1,
        "fielduuid": "dbc6a83d-5374-42ef-9ccc-c518232ca46d",
        "title": "Serial number",
        "type": "TEXT",
        "key": "serial_number",
        "is_required_for_agents": false,
        "is_required_on_resolution": false,
        "is_visible_to_customers": true,
        "
customer_titles": [
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

**POST** **/api/v1/cases/fields.json**

### **Information**

| Allowed for | Admins & Owners |
| :---- | :---- |
| Scope | [configuration](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1) |

### **Parameters**

| Name | Type | Mandatory | Description |
| :---- | :---- | :---: | :---- |
| type | string |  | TEXT, TEXTAREA, CHECKBOX, RADIO, SELECT, DATE, FILE, NUMERIC, DECIMAL, YESNO, CASCADINGSELECT, REGEX  **Note:** If field type CHECKBOX, RADIO, SELECT, CASCADINGSELECT [Add Options](https://developer.kayako.com/api/v1/users/fields#Options) |
| title | string |  |  |
| is\_required\_for\_agents | boolean |  | Required when creating, reply and updating a conversation **Default:** false |
| is\_required\_on\_resolution | boolean |  | Required when resolving a conversation **Default:** false |
| is\_visible\_to\_customers | boolean |  | **Default:** false |
| customer\_titles | string |  | Only applicable when "Customers can see this field" is enabled |
| is\_customer\_editable | boolean |  | Only applicable when "Customers can see this field" is enabled **Default:** false |
| is\_required\_for\_customers | boolean |  | Only applicable when "Customers can edit this field" is enabled **Default:** false |
| descriptions | string |  | User-defined description of this field's purpose |
| is\_enabled | boolean |  | **Default:** true |
| regular\_expression | string |  | Regular expression field only. The validation pattern for a field value to be deemed valid. |
| options | string |  |  |

### **Request**

```

curl -X POST https://brewfictus.kayako.com/api/v1/cases/fields \
     -d '{"title":"Your coffee","type":"SELECT","is_required_for_agents":true,"is_required_on_resolution":true,"is_visible_to_customers":true,"customer_titles":[{"locale":"en-us", "translation": "Your coffee"}, {"locale":"fr", "translation": "Ihren Kaffee"}],descriptions":[],"is_customer_editable":true,"is_required_for_customers":true,"regular_expression":null,"is_enabled":true,"options":[{"values":[{"locale":"en-us","translation":"Yirgacheffe Oromia - Single Origin"}, {"locale":"fr","translation":"Yirgacheffe Oromia - Origine unique"}], "tag":"yirgacheffe-oromia", "sort_order":"1"},{"values":[{"locale":"en-us","translation":"Kenya Kiunyu Ab - Single Origin"}, {"locale":"fr","translation":"Kenya Kiunyu Ab - Origine unique"}], "tag":"kenya-kiunyu-ab", "sort_order":"2"}]}' \
     -H "Content-Type: application/json" \
     -u 'jordan.mitchell@brewfictus.com:jmit6#lsXo'

```

### **Response**

```

{
    "status": 201,
    "
data": {
        "id": 1,
        "fielduuid": "dbc6a83d-5374-42ef-9ccc-c518232ca46d",
        "title": "Serial number",
        "type": "TEXT",
        "key": "serial_number",
        "is_required_for_agents": false,
        "is_required_on_resolution": false,
        "is_visible_to_customers": true,
        "
customer_titles": [
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

**PUT** **/api/v1/cases/fields/:id.json**

### **Information**

| Allowed for | Admins & Owners |
| :---- | :---- |
| Scope | [configuration](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1) |

### **Parameters**

| Name | Type | Mandatory | Description |
| :---- | :---- | :---: | :---- |
| title | string |  |  |
| is\_required\_for\_agents | boolean |  |  |
| is\_required\_on\_resolution | boolean |  |  |
| is\_visible\_to\_customers | boolean |  |  |
| customer\_titles | string |  |  |
| is\_customer\_editable | boolean |  |  |
| is\_required\_for\_customers | boolean |  |  |
| descriptions | string |  |  |
| is\_enabled | boolean |  |  |
| regular\_expression | string |  |  |
| options | string |  |  |

### **Request**

```

curl -X PUT https://brewfictus.kayako.com/api/v1/cases/fields/:id \
     -d '{"title":"Your coffee","type":"SELECT","is_required_for_agents":true,"is_required_on_resolution":true,"is_visible_to_customers":true,"customer_titles":[{"id":"20",locale":"en-us", "translation": "Your coffee"}, {"id":"21","locale":"fr", "translation": "Ihren Kaffee"}],descriptions":[],"is_customer_editable":true,"is_required_for_customers":true,"regular_expression":null,"is_enabled":true,"options":[{"id":"4","values":[{"id":"22","locale":"en-us","translation":"Yirgacheffe Oromia - Single Origin"}, {"id":"23","locale":"fr","translation":"Yirgacheffe Oromia - Origine unique"}], "tag":"yirgacheffe-oromia", "sort_order":"1"},{"id":"5","values":[{"id":"24","locale":"en-us","translation":"Kenya Kiunyu Ab - Single Origin"}, {"id":"25","locale":"fr","translation":"Kenya Kiunyu Ab - Origine unique"}], "tag":"kenya-kiunyu-ab", "sort_order":"2"}]}' \
     -H "Content-Type: application/json" \
     -u 'jordan.mitchell@brewfictus.com:jmit6#lsXo'

```

### **Response**

```

{
    "status": 200,
    "
data": {
        "id": 1,
        "fielduuid": "dbc6a83d-5374-42ef-9ccc-c518232ca46d",
        "title": "Serial number",
        "type": "TEXT",
        "key": "serial_number",
        "is_required_for_agents": false,
        "is_required_on_resolution": false,
        "is_visible_to_customers": true,
        "
customer_titles": [
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

**PUT** **/api/v1/cases/fields/reorder.json**

### **Information**

| Allowed for | Admins & Owners |
| :---- | :---- |
| Scope | [configuration](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1) |

### **Parameters**

| Name | Type | Mandatory | Description |
| :---- | :---- | :---: | :---- |
| field\_ids | string |  | Pass the fields in order you want to set |

### **Response**

```

{
    "status": 200,
    "total_count": 3
}
```

## Delete a field

**DELETE** **/api/v1/cases/fields/:id.json**

### **Information**

| Allowed for | Admins & Owners |
| :---- | :---- |
| Scope | [configuration](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1) |

### **Response**

```

{
    "status": 200
}
```

## Delete fields

**DELETE** **/api/v1/cases/fields.json**

### **Information**

| Allowed for | Admins & Owners |
| :---- | :---- |
| Scope | [configuration](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1) |

### **Arguments**

| Name | Type | Mandatory | Description |
| :---- | :---- | :---: | :---- |
| ids | string |  | The comma separated ids |

### **Response**

```

{
    "status": 200,
    "total_count": 2
}
```

## Options

### **RESOURCE FIELDS**

| Name | Type | Read-only | Description |
| :---- | :---- | :---: | :---- |
| fielduuid | string |  |  |
| values | [Field Locales](https://developer.kayako.com/api/v1/general/field_locales/) |  |  |
| sort\_order | integer |  | Ordering of the option relative to other options |
| created\_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated\_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |

## Reorder options

**PUT** **/api/v1/cases/fields/:id/options/reorder.json**

### **Information**

| Allowed for | Admins & Owners |
| :---- | :---- |
| Scope | [configuration](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1) |

### **Parameters**

| Name | Type | Mandatory | Description |
| :---- | :---- | :---: | :---- |
| option\_ids | string |  | Pass the options in order you want to set |

### **Response**

```

{
    "status": 200,
    "total_count": 3
}
```

## Delete a option

**DELETE** **/api/v1/cases/fields/:id/options/:id.json**

### **Information**

| Allowed for | Admins & Owners |
| :---- | :---- |
| Scope | [configuration](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1) |

### **Response**

```

{
    "status": 200
}
```

## Delete options

**DELETE** **/api/v1/cases/fields/:id/options.json**

### **Information**

| Allowed for | Admins & Owners |
| :---- | :---- |
| Scope | [configuration](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1) |

### **Arguments**

| Name | Type | Mandatory | Description |
| :---- | :---- | :---: | :---- |
| ids | string |  | The comma separated ids |

### **Response**

```

{
    "status": 200,
    "total_count": 2
}
```

## Values

### **RESOURCE FIELDS**

| Name | Type | Read-only | Description |
| :---- | :---- | :---: | :---- |
| field | [Field](https://developer.kayako.com/api/v1/cases/fields) |  |  |
| value | string |  |  |

## Retrieve values

**GET** **/api/v1/cases/:id/field/values.json**

### **Information**

| Allowed for | Collaborators |
| :---- | :---- |
| Scope | [conversations](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1) |

### **Response**

```

{
    "status": 200,
    "
data": [
        {
            "
field": {
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

# Forms

## Resource Fields

| Name | Type | Read-only | Description |
| :---- | :---- | :---: | :---- |
| title | string |  |  |
| is\_visible\_to\_customers | boolean |  | Is the form visible to the end user **Default:** false |
| customer\_title | string |  |  |
| customer\_titles | [Field Locales](https://developer.kayako.com/api/v1/general/field_locales/) |  |  |
| description | string |  |  |
| descriptions | [Field Locales](https://developer.kayako.com/api/v1/general/field_locales/) |  |  |
| is\_enabled | boolean |  | **Default:** true |
| is\_default | boolean |  | **Default:** false |
| is\_deleted | boolean |  |  |
| sort\_order | integer |  | Ordering of the field relative to other fields |
| fields | [Fields](https://developer.kayako.com/api/v1/cases/fields/) |  |  |
| brand | [Brands](https://developer.kayako.com/api/v1/general/brands/) |  |  |
| created\_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |
| updated\_at | timestamp |  | [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) Format |



## Metadata

  

| Version | 1.0 |
| :---- | :---- |
| Last Updated | January 13, 2017 |

## Actions

## Retrieve all forms

**GET** **/api/v1/cases/forms.json**

### **Information**

| Allowed for | Collaborators, Agents, Admins & Owners |
| :---- | :---- |
| Scope | [configuration](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1) |
| Ordered by | sort\_order (ascending) |

Collaborators and Agents can see the enabled forms.

### **Response**

```

{
    "status": 200,
    "
data": [
        {
            "id": 1,
            "title": "Maintenance job form",
            "is_visible_to_customers": true,
            "customer_title": "Maintenance job form",
            "
customer_titles": [
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
            "
descriptions": [
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
            "
fields": [
                {
                    "id": 1,
                    "resource_type": "case_field"
                }
            ],
            "
brand": {
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

**GET** **/api/v1/cases/forms/:id.json**

### **Information**

| Allowed for | Collaborators, Agents, Admins & Owners |
| :---- | :---- |
| Scope | [configuration](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1) |

Collaborators and Agents can see the enabled fields.

### **Response**

```

{
    "status": 200,
    "
data": {
        "id": 1,
        "title": "Maintenance job form",
        "is_visible_to_customers": true,
        "customer_title": "Maintenance job form",
        "
customer_titles": [
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
        "
descriptions": [
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
        "
fields": [
            {
                "id": 1,
                "resource_type": "case_field"
            }
        ],
        "
brand": {
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

**POST** **/api/v1/cases/forms.json**

### **Information**

| Allowed for | Admins & Owners |
| :---- | :---- |
| Scope | [configuration](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1) |

### **Parameters**

| Name | Type | Mandatory | Description |
| :---- | :---- | :---: | :---- |
| title | string |  |  |
| case\_field\_ids | string |  |  |
| is\_visible\_to\_customers | boolean |  | Is the form visible to the end user **Default:** false |
| customer\_titles | string |  | Only applicable when "Customers can see this form" is enabled |
| descriptions | string |  | User-defined description |
| brand\_id | integer |  |  |

### **Response**

```

{
    "status": 201,
    "
data": {
        "id": 1,
        "title": "Maintenance job form",
        "is_visible_to_customers": true,
        "customer_title": "Maintenance job form",
        "
customer_titles": [
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
        "
descriptions": [
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
        "
fields": [
            {
                "id": 1,
                "resource_type": "case_field"
            }
        ],
        "
brand": {
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

**PUT** **/api/v1/cases/forms/:id.json**

### **Information**

| Allowed for | Admins & Owners |
| :---- | :---- |
| Scope | [configuration](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1) |

### **Parameters**

| Name | Type | Mandatory | Description |
| :---- | :---- | :---: | :---- |
| title | string |  |  |
| is\_visible\_to\_customers | boolean |  |  |
| customer\_titles | string |  | Only applicable when "Customers can see this field" is enabled |
| descriptions | string |  | User-defined description |
| is\_enabled | boolean |  |  |
| case\_field\_ids | string |  | **Warning:** All conversation field ids must be passed on update except system field ids. ids that are not passed will be removed |
| brand\_id | integer |  | If pass null or empty, then linking of brand with this form will get remove. |

### **Response**

```

{
    "status": 200,
    "
data": {
        "id": 1,
        "title": "Maintenance job form",
        "is_visible_to_customers": true,
        "customer_title": "Maintenance job form",
        "
customer_titles": [
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
        "
descriptions": [
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
        "
fields": [
            {
                "id": 1,
                "resource_type": "case_field"
            }
        ],
        "
brand": {
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

**PUT** **/api/v1/cases/forms/default.json**

### **Information**

| Allowed for | Admins & Owners |
| :---- | :---- |
| Scope | [configuration](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1) |

### **Parameters**

| Name | Type | Mandatory | Description |
| :---- | :---- | :---: | :---- |
| form\_id | integer |  |  |

### **Response**

```

{
    "status": 200
}
```

## Update forms

**PUT** **/api/v1/cases/forms.json**

### **Information**

| Allowed for | Admins & Owners |
| :---- | :---- |
| Scope | [configuration](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1) |

### **Arguments**

| Name | Type | Mandatory | Description |
| :---- | :---- | :---: | :---- |
| ids | string |  | The comma separated ids |

### **Parameters**

| Name | Type | Mandatory | Description |
| :---- | :---- | :---: | :---- |
| is\_enabled | boolean |  |  |

### **Response**

```

{
    "status": 200,
    "total_count": 2
}
```

## Reorder forms

**PUT** **/api/v1/cases/forms/reorder.json**

### **Information**

| Allowed for | Admins & Owners |
| :---- | :---- |
| Scope | [configuration](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1) |

### **Parameters**

| Name | Type | Mandatory | Description |
| :---- | :---- | :---: | :---- |
| form\_ids | string |  | Pass the forms in order you want to set |

### **Response**

```

{
    "status": 200,
    "total_count": 3
}
```

## Delete a form

**DELETE** **/api/v1/cases/forms/:id.json**

### **Information**

| Allowed for | Admins & Owners |
| :---- | :---- |
| Scope | [configuration](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1) |

### **Response**

```

{
    "status": 200
}
```

## Delete forms

**DELETE** **/api/v1/cases/forms.json**

### **Information**

| Allowed for | Admins & Owners |
| :---- | :---- |
| Scope | [configuration](https://developer.kayako.com/api/v1/reference/authentication/#api-scopes-1.2.1) |

### **Arguments**

| Name | Type | Mandatory | Description |
| :---- | :---- | :---: | :---- |
| ids | string |  | The comma separated ids |

### **Response**

```

{
    "status": 200,
    "total_count": 2
}
```

[image1]: <data:image/png;base64,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>

[image2]: <data:image/png;base64,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>

[image3]: <data:image/png;base64,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>
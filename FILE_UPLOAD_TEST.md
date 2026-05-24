# Testing File Upload & Serve

## 1. Test Create Target with Image Upload

### Setup in Insomnia

**Method:** POST  
**URL:** `http://localhost:8080/api/targets`

**Headers:**
- Add `Authorization: Bearer <your_jwt_token>` (if required)

**Body Type:** Multipart Form

**Fields:**
| Field Name | Type | Value | Example |
|---|---|---|---|
| `title` | Text | Target name | "Liburan ke Bali" |
| `targetAmount` | Text | Amount number | "5000000" |
| `frequencyAmount` | Text | Amount number | "500000" |
| `frequency` | Text | Enum value | "MONTHLY" |
| `deadline` | Text | ISO date | "2026-12-31" |
| `image` | **File** | Select image file | (PNG/JPG, max 5MB) |

### Example Response

```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "user-uuid",
    "title": "Liburan ke Bali",
    "imageUrl": "http://localhost:8080/uploads/550e8400-e29b-41d4-a716-446655440000.png",
    "status": "ACTIVE",
    "targetAmount": 5000000,
    "currentAmount": 0,
    "frequency": "MONTHLY",
    "frequencyAmount": 500000,
    "deadline": "2026-12-31"
  }
}
```

## 2. Test Image Serve Endpoint

### Direct Access
Copy the `imageUrl` from response → paste in browser or use:

```bash
curl -H "Accept: image/*" http://localhost:8080/uploads/550e8400-e29b-41d4-a716-446655440000.png
```

**Expected Status:** `200 OK`  
**Expected Response:** Image file with `Content-Type: image/png` (or `image/jpeg`)

## 3. Verify Logs

Watch backend logs while testing:

```bash
# If running via Docker
docker compose logs -f backend

# Check for logs like:
# - "Saving image to directory: /app/uploads/images"
# - "Generated filename: <uuid>.png"
# - "File saved successfully at: /app/uploads/images/<uuid>.png"
# - "Returning image URL: http://localhost:8080/uploads/<uuid>.png"
```

## 4. Troubleshooting

### Issue: `404 Not Found` when accessing image URL

**Check 1:** Verify file exists in container
```bash
docker exec tago-backend ls -la /app/uploads/images/
```

**Check 2:** Verify path configuration
```bash
docker exec tago-backend env | grep APP_UPLOAD_DIR
```
Should output: `APP_UPLOAD_DIR=/app/uploads/images/`

**Check 3:** Check backend logs for errors
```bash
docker compose logs backend | grep -i "image\|save\|upload"
```

**Check 4:** Verify volume mount on host
```bash
ls -la ./uploads/images/
```
Files should be visible here if saved successfully.

## 5. Common Errors

| Error | Cause | Fix |
|---|---|---|
| `404 Not Found` on image URL | File not saved or wrong path | Check logs + verify `/uploads/images/` directory |
| `400 Bad Request` on create | Multipart format wrong | Ensure Content-Type is `multipart/form-data` |
| `413 Payload Too Large` | File > 5MB | Reduce file size |
| File exists but 404 | Permission issue | Check directory permissions in container |


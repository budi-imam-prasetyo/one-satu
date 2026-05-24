# Frontend Create Target Implementation

## Summary

Implemented real API integration for **Create Target** endpoint on the frontend with the following features:

### Key Changes

#### 1. **targetService.ts**
- Converted `createTarget()` to accept individual parameters instead of body object
- Signature:
```typescript
export const createTarget = async (
  name: string,
  targetAmount: number,
  savingAmount: number,
  savingSchedule: 'daily' | 'weekly' | 'monthly',
  imageBase64?: string,
  deadline?: string
): Promise<ApiTarget>
```

- **Features:**
  - Converts base64 image (from UI) to Blob for multipart upload
  - Builds FormData with proper field mapping:
    - `title` ← name
    - `targetAmount` ← targetAmount
    - `frequencyAmount` ← savingAmount
    - `frequency` ← savingSchedule (converted to uppercase: DAILY/WEEKLY/MONTHLY)
    - `deadline` ← deadline (converted to ISO date format YYYY-MM-DD)
    - `image` ← Blob from base64 (multipart file)
  - Handles multipart/form-data with correct headers (no Content-Type, let browser set it)
  - Proper error handling with detailed error messages

#### 2. **AppProvider.tsx**
- Updated `addTarget()` function to:
  - Call real API with `targetService.createTarget()`
  - Map API response to frontend `Target` type using `mapApiTarget()`
  - Handle API failures gracefully with error logging
  - Fallback to local state if API fails

#### 3. **config/index.ts**
- Updated `BASE_URL` to support environment variable:
  - Uses `VITE_API_URL` environment variable if available
  - Defaults to `http://localhost:8080` for local development

## Testing Steps

### 1. Start Backend & Frontend
```bash
# Terminal 1: Start Docker stack
docker compose --profile dev up --build

# Wait for services to be ready (check backend/frontend logs)
```

### 2. Test Create Target via Frontend UI
1. Open `http://localhost:5173` (frontend dev)
2. Login or continue as guest
3. Click "Buat Target Baru" button
4. Fill form:
   - **Nama Target**: "Liburan Bali"
   - **Gambar**: Click to select PNG/JPG image
   - **Target Nominal**: "5000000"
   - **Jadwal Menabung**: Select "Bulanan"
   - **Nominal per Bulan**: "500000"
5. Click "Simpan"

### 3. Verify Success
✅ **Expected Behavior:**
- Modal closes
- Target appears at top of Dashboard
- Image displays on target card
- Status: ACTIVE

### 4. Check Backend Logs
```bash
docker compose logs -f backend | grep -i "image\|save\|upload"
```

Expected logs:
```
Saving image to directory: /app/uploads/images/
Generated filename: {uuid}.png
File saved successfully at: /app/uploads/images/{uuid}.png
Returning image URL: http://localhost:8080/uploads/{uuid}.png
```

### 5. Access Image from API Response
- Response `imageUrl` field should contain:
  `http://localhost:8080/uploads/{filename}`
- Test access in browser or curl:
```bash
curl -v http://localhost:8080/uploads/{filename}.png
```

Expected: `200 OK` with image binary data

## Field Mapping Reference

| Frontend | Backend | Type | Notes |
|----------|---------|------|-------|
| `name` | `title` | Text | Target name |
| `targetAmount` | `targetAmount` | BigDecimal | Rp amount |
| `savingAmount` | `frequencyAmount` | BigDecimal | Rp per period |
| `savingSchedule` | `frequency` | Enum | DAILY/WEEKLY/MONTHLY |
| `image` (base64) | `image` (multipart) | File | Converted to Blob |
| `deadline` | `deadline` | Date | ISO format |

## Error Handling

### Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| 404 on create | BASE_URL wrong or backend not running | Check `VITE_API_URL` env var |
| 400 Bad Request | Invalid field format | Check field mapping above |
| 413 Payload Too Large | Image > 5MB | Reduce image size |
| CORS error | Backend origin not whitelisted | Check SecurityConfig |
| Failed to convert image | Invalid base64 string | Ensure image was properly read |

## Environment Variables

Create `.env` in frontend directory:
```env
VITE_API_URL=http://localhost:8080
```

Or in Docker (compose.yaml already set):
```yaml
environment:
  VITE_API_URL: http://localhost:8080
```

## Code Quality

- ✅ Proper error handling and logging
- ✅ Type-safe with TypeScript
- ✅ Follows existing project structure
- ✅ Graceful fallback for API-less scenarios
- ✅ CORS-compatible headers
- ✅ Proper FormData multipart handling


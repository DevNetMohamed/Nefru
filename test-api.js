#!/usr/bin/env node
/**
 * Test Script for GuideProfile & Info Pages API
 *
 * Usage:
 *   node test-api.js <tripId> <guideId>
 *
 * Example:
 *   node test-api.js 507f1f77bcf86cd799439011 507f1f77bcf86cd799439012
 */

const http = require("http");

const API_BASE_URL = process.env.API_URL || "http://localhost:3000";

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_BASE_URL);

    http
      .get(url, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            const parsed = JSON.parse(data);
            resolve({
              status: res.statusCode,
              data: parsed,
              headers: res.headers,
            });
          } catch (e) {
            resolve({
              status: res.statusCode,
              data: data,
              error: e.message,
            });
          }
        });
      })
      .on("error", reject);
  });
}

async function testGuideEndpoint(guideId) {
  console.log("\n=== Testing Guide Profile Endpoint ===");
  console.log(`GET /api/guides/${guideId}`);
  console.log("---");

  try {
    const result = await makeRequest(`/api/guides/${guideId}`);

    if (result.status === 200) {
      console.log("✅ Status: 200 OK\n");
      const guide = result.data.data;

      // Check required fields
      const requiredFields = [
        "id",
        "name",
        "profileImage",
        "heroImage",
        "headline",
        "location",
        "verified",
        "rating",
        "reviewsCount",
        "yearsExperience",
        "languages",
        "about",
        "gallery",
        "tours",
      ];

      console.log("Required Fields Check:");
      requiredFields.forEach((field) => {
        const hasField = field in guide;
        const status = hasField ? "✅" : "❌";
        const value = guide[field];
        const valueStr = Array.isArray(value)
          ? `[Array(${value.length})]`
          : typeof value === "string" && value.length > 30
            ? `"${value.substring(0, 30)}..."`
            : `${JSON.stringify(value)}`;

        console.log(`  ${status} ${field}: ${valueStr}`);
      });

      // Check title field (new field)
      if ("title" in guide) {
        console.log(`  ✅ title (NEW): "${guide.title}"`);
      } else {
        console.log(`  ⚠️  title (NEW): Missing`);
      }

      console.log("\nSample Guide Data:");
      console.log(`  Name: ${guide.name}`);
      console.log(`  Location: ${guide.location}`);
      console.log(
        `  Rating: ${guide.rating}/5 (${guide.reviewsCount} reviews)`,
      );
      console.log(`  Verified: ${guide.verified}`);
    } else {
      console.log(`❌ Status: ${result.status}`);
      console.log("Response:", result.data);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

async function testTripEndpoint(tripId) {
  console.log("\n=== Testing Trip Details Endpoint ===");
  console.log(`GET /api/trips/${tripId}`);
  console.log("---");

  try {
    const result = await makeRequest(`/api/trips/${tripId}`);

    if (result.status === 200) {
      console.log("✅ Status: 200 OK\n");
      const trip = result.data.data;

      // Check required fields
      const requiredFields = [
        "id",
        "title",
        "description",
        "longDescription",
        "location",
        "price",
        "duration",
        "image",
        "category",
        "rating",
        "reviewsCount",
        "highlights",
        "reviews",
      ];

      console.log("Required Fields Check:");
      requiredFields.forEach((field) => {
        const hasField = field in trip;
        const status = hasField ? "✅" : "❌";
        const value = trip[field];
        const valueStr = Array.isArray(value)
          ? `[Array(${value.length})]`
          : typeof value === "string" && value.length > 30
            ? `"${value.substring(0, 30)}..."`
            : `${JSON.stringify(value)}`;

        console.log(`  ${status} ${field}: ${valueStr}`);
      });

      // Check guide object
      console.log("\nGuide Object Check:");
      if ("guide" in trip) {
        const guide = trip.guide;
        const guideFields = [
          "id",
          "name",
          "avatar",
          "badge",
          "rating",
          "reviewsCount",
          "about",
          "verified",
        ];
        guideFields.forEach((field) => {
          const hasField = field in guide;
          const status = hasField ? "✅" : "❌";
          const value = guide[field];
          const valueStr =
            typeof value === "string" && value.length > 30
              ? `"${value.substring(0, 30)}..."`
              : `${JSON.stringify(value)}`;

          console.log(`  ${status} guide.${field}: ${valueStr}`);
        });
      } else {
        console.log("  ❌ guide object missing");
      }

      console.log("\nSample Trip Data:");
      console.log(`  Title: ${trip.title}`);
      console.log(`  Location: ${trip.location}`);
      console.log(`  Price: $${trip.price}`);
      console.log(`  Duration: ${trip.duration}`);
      console.log(`  Rating: ${trip.rating}/5 (${trip.reviewsCount} reviews)`);
      console.log(`  Highlights: ${trip.highlights.length} items`);
      console.log(`  Reviews: ${trip.reviews.length} items`);
      console.log(`  Guide: ${trip.guide?.name || "N/A"}`);
    } else {
      console.log(`❌ Status: ${result.status}`);
      console.log("Response:", result.data);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

async function main() {
  const [tripId, guideId] = process.argv.slice(2);

  if (!tripId || !guideId) {
    console.log("Test Script for GuideProfile & Info Pages API");
    console.log("\nUsage: node test-api.js <tripId> <guideId>");
    console.log("\nExample:");
    console.log(
      "  node test-api.js 507f1f77bcf86cd799439011 507f1f77bcf86cd799439012",
    );
    console.log("\nMake sure:");
    console.log("  1. Backend server is running on http://localhost:3000");
    console.log(
      "  2. Database has at least one trip and one guide with the provided IDs",
    );
    console.log("  3. IDs are valid MongoDB ObjectIds");
    return;
  }

  console.log("🚀 Testing Backend API Endpoints");
  console.log(`API Base URL: ${API_BASE_URL}`);

  await testGuideEndpoint(guideId);
  await testTripEndpoint(tripId);

  console.log("\n=== Test Complete ===\n");
}

main().catch(console.error);

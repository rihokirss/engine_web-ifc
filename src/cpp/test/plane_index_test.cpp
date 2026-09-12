#include <array>
#include <cmath>
#include "TinyCppTest.hpp"
#include "../web-ifc/geometry/operations/bim-geometry/utils.h"
#include "../web-ifc/geometry/operations/bim-geometry/geometry.h"

TEST(PlaneIndexPreservesFirstMatchingPlane)
{
    bimGeometry::Geometry geometry;
    std::array<std::array<glm::dvec3, 3>, 128> triangles;
    for (size_t i = 0; i < triangles.size(); ++i)
    {
        const double angle = 2 * std::acos(-1.0) * i / triangles.size();
        const glm::dvec3 normal(std::cos(angle), std::sin(angle), 0);
        const glm::dvec3 tangent(-normal.y, normal.x, 0);
        const glm::dvec3 vertical(0, 0, 1);
        triangles[i] = {5.0 * normal - .25 * tangent - .25 * vertical,
                        5.0 * normal + .25 * tangent - .25 * vertical,
                        5.0 * normal + .25 * vertical};
        const auto& p = triangles[i];
        geometry.AddFace(p[0], p[1], p[2]);
    }
    for (const size_t index : {size_t(0), size_t(64), size_t(127)})
    {
        const auto& p = triangles[index];
        geometry.AddFace(p[0], p[1], p[2]);
    }
    geometry.buildPlanes();
    ASSERT_EQ(geometry.planes.size(), size_t(128));
    ASSERT_EQ(geometry.planeData.size(), size_t(131));
    for (uint32_t i = 0; i < 128; ++i) ASSERT_EQ(geometry.planeData[i], i);
    ASSERT_EQ(geometry.planeData[128], uint32_t(0));
    ASSERT_EQ(geometry.planeData[129], uint32_t(64));
    ASSERT_EQ(geometry.planeData[130], uint32_t(127));
}

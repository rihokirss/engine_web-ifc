#include <algorithm>
#include <array>
#include <cstdint>
#include <limits>
#include <stack>
#include "TinyCppTest.hpp"
#include "../web-ifc/geometry/operations/boolean-utils/bvh.h"

TEST(BvhBoxQueriesMatchFaceBounds)
{
    for (double scale : {0.001, 1.0, 1000.0})
    {
        fuzzybools::Geometry geometry;
        for (uint32_t i = 0; i < 160; ++i)
        {
            const glm::dvec3 origin = scale * glm::dvec3(i % 11, (i / 11) % 7, i / 77);
            geometry.AddFace(origin, origin + scale * glm::dvec3(0.6, 0, 0.1),
                             origin + scale * glm::dvec3(0, 0.7, 0.2), UINT32_MAX);
        }
        ASSERT_EQ(geometry.numFaces, uint32_t(160));
        const auto tree = fuzzybools::MakeBVH(geometry);
        uint32_t state = 1729;
        auto random = [&]()
        {
            state = 1664525 * state + 1013904223;
            return static_cast<double>(state) / std::numeric_limits<uint32_t>::max();
        };
        for (uint32_t queryIndex = 0; queryIndex < 500; ++queryIndex)
        {
            fuzzybools::AABB query;
            query.min = scale * glm::dvec3(14 * random() - 2, 10 * random() - 2, 5 * random() - 1);
            query.max = query.min + scale * glm::dvec3(random(), random(), random());
            bool expected = false;
            for (uint32_t face = 0; face < geometry.numFaces; ++face)
            {
                if (geometry.GetFaceBox(face).intersects(query))
                {
                    expected = true;
                    break;
                }
            }
            ASSERT_EQ(tree.IntersectsBox(query), expected);
        }
        for (uint32_t face = 0; face < geometry.numFaces; ++face)
        {
            auto query = geometry.GetFaceBox(face);
            query.max = query.min; // A zero-size query touching a face bound.
            ASSERT_EQ(tree.IntersectsBox(query), true);
        }
    }
    const fuzzybools::BVH empty{};
    const fuzzybools::AABB query{};
    ASSERT_EQ(empty.IntersectsBox(query), false);
}

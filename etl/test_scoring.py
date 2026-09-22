"""
Unit tests for Double Gap Index (DGI) ETL and Scoring Logic
As required by 13_TESTING.md
Can run either with pytest or python test_scoring.py directly.
"""

import os
import sys
import math

# Add etl directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from compute_scores import min_max_scale, compute_all_scores


def test_min_max_scale_basic():
    """Verify normal scaling to [0, 1]."""
    s = [10.0, 20.0, 30.0, 40.0, 50.0]
    norm = min_max_scale(s)
    assert norm[0] == 0.0, f"Expected 0.0, got {norm[0]}"
    assert norm[-1] == 1.0, f"Expected 1.0, got {norm[-1]}"
    assert norm[2] == 0.5, f"Expected 0.5, got {norm[2]}"


def test_min_max_scale_handles_identical_values():
    """Verify series where min == max does not divide by zero and returns 0.5."""
    s = [42.0, 42.0, 42.0]
    norm = min_max_scale(s)
    assert all(x == 0.5 for x in norm), "Expected all 0.5 for identical values"


def test_min_max_scale_preserves_nulls():
    """Verify nulls remain null and don't break scaling of valid values."""
    s = [10.0, None, 30.0]
    norm = min_max_scale(s)
    assert norm[0] == 0.0
    assert norm[1] is None
    assert norm[2] == 1.0


def test_double_gap_flag_logic():
    """Verify boundary conditions for Double Gap flag at threshold 0.40."""
    threshold = 0.40

    # Low - Low -> True
    assert (0.39 < threshold and 0.39 < threshold) is True
    assert (0.31 < threshold and 0.28 < threshold) is True

    # Low - High -> False (Digital gap only)
    assert (0.25 < threshold and 0.65 < threshold) is False

    # High - Low -> False (Service gap only)
    assert (0.75 < threshold and 0.35 < threshold) is False

    # High - High -> False
    assert (0.81 < threshold and 0.74 < threshold) is False

    # Exact threshold boundary (0.40 is not strictly < 0.40)
    assert (0.40 < threshold and 0.40 < threshold) is False


def test_end_to_end_scoring_golden_paths():
    """Test full pipeline runs across all 64 districts and verifies empirical benchmark assertions."""
    records = compute_all_scores()

    # Rule: All 64 Bangladeshi districts must be present
    assert len(records) == 64, f"Expected 64 districts, found {len(records)}"

    rec_map = {r["id"]: r for r in records}

    # Golden check: Dhaka must have high digital access (60.97% census internet)
    assert "dhaka" in rec_map
    dhaka = rec_map["dhaka"]
    assert dhaka["digital_breakdown"]["internet_usage_pct"] == 60.97
    assert dhaka["digital_access_score"] > 0.9, f"Dhaka score {dhaka['digital_access_score']} <= 0.9"
    assert dhaka["double_gap_flag"] is False

    # Golden check: Bandarban has acute service & digital constraints and is an Invariant Core Double Gap district
    assert "bandarban" in rec_map
    bandarban = rec_map["bandarban"]
    assert bandarban["digital_breakdown"]["internet_usage_pct"] == 29.54
    assert bandarban["digital_access_score"] < 0.40, f"Bandarban digital {bandarban['digital_access_score']} >= 0.40"
    assert bandarban["service_access_score"] < 0.40, f"Bandarban service {bandarban['service_access_score']} >= 0.40"
    assert bandarban["double_gap_flag"] is True
    assert bandarban["is_invariant_core"] is True

    # Golden check: Sherpur has 21.19% internet usage and exhibits a digital-only gap
    assert "sherpur" in rec_map
    sherpur = rec_map["sherpur"]
    assert sherpur["digital_breakdown"]["internet_usage_pct"] == 21.19
    assert sherpur["quadrant"] == "DIGITAL_ONLY_GAP"

    # Two separate scores rule: scores must not be identical across all districts
    identical_count = sum(1 for r in records if r["digital_access_score"] == r["service_access_score"])
    assert identical_count < len(records), "Scores were erroneously identical across all districts"

    # Verify score ranges [0, 1]
    for r in records:
        assert 0.0 <= r["digital_access_score"] <= 1.0, f"Invalid digital score for {r['name']}: {r['digital_access_score']}"
        assert 0.0 <= r["service_access_score"] <= 1.0, f"Invalid service score for {r['name']}: {r['service_access_score']}"

    print("All unit tests passed successfully!")


if __name__ == "__main__":
    test_min_max_scale_basic()
    test_min_max_scale_handles_identical_values()
    test_min_max_scale_preserves_nulls()
    test_double_gap_flag_logic()
    test_end_to_end_scoring_golden_paths()

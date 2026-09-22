# SOURCES.md — Empirical Data Governance & Provenance Specification

> **Document Status:** Verified Against Official Records on Local Filesystem  
> **Primary Authority:** Bangladesh Bureau of Statistics (BBS) — *Population and Housing Census 2022 (Admin 02 Dataset)*  
> **Distribution Node:** UN OCHA Humanitarian Data Exchange (HDX) [Dataset `populationa-and-housing-census-dataset`](https://data.humdata.org/dataset/populationa-and-housing-census-dataset)  
> **Local Verified Raw Data:** `etl/verified_raw/bbs_census_2022_admin02.xlsx` (1,213,869 bytes)  
> **Official Codebook:** `etl/verified_raw/indicator_definition_admin02.xlsx` (186,071 bytes)  
> **LGED Health Data:** `etl/verified_raw/health_facilities_lged/bgd_poi_healthfacilities_lged.dbf` (2,484 facilities)  
> **LGED Education Data:** `etl/verified_raw/education_facilities_lged/bgd_poi_educationfacilities_lged.dbf` (78,129 points)  
> **Audit Standard:** Direct census enumeration, verified administrative records, zero imputation, Rule 4 preservation of nulls.

---

## 1. Provenance & Census Enumeration Confirmation

### Direct Census Measurements vs. Sample Survey Estimates
A foundational question in evaluating subnational indicators is whether they are:
1. Modeled small-area estimates,
2. Inferred from small sample surveys, or
3. Direct individual enumerations from a national census.

**Verification from Primary Census Records (`bbs_census_2022_admin02.xlsx` & `indicator_definition_admin02.xlsx`):**
The Bangladesh Bureau of Statistics (BBS) conducted the **Population and Housing Census 2022** digitally using CAPI (Computer-Assisted Personal Interviewing) tablets across every enumeration area in Bangladesh in June 2022.
- **Population Count in Local Dataset:** Sheet `'Population_District'`, column `'# Overall_Bangladeshi_National'` records an exact sum of **165,130,774** individuals across the 64 districts (ranging from 467,216 in Bandarban to 7,934,348 in Chattogram). Rates in the census sheets are calculated using the enumerated population aged 15 years and above as the denominator.
- **CAPI Questionnaire ICT Items:** In the official indicator dictionary (`indicator_definition_admin02.xlsx`), the items correspond to direct individual questions administered to all enumerated households:
  - Sheet `' Population having Mobile Phone'`: `%_Mobile Phone_Total_15 year+` ("Percentage of 15 Years+ Population use Mobile Phone")
  - Sheet `'Internet User'`: `%_Inernet_Total_15 year+` ("Percentage of 15 Years+ Population Use Internet")
  - Sheet `' Having Mobile Banking Account'`: `%_Mobile Bank Account_Overall` ("Percentage of Population Aged 15 Years and above having Mobile Bank Account")
  - Sheet `'Having Account in Financial'`: `%_Have financial account_Overall` ("Percentage of Population Aged 15 Years and above having Account in Financial Bank")
- **Status:** These are **direct census enumerations of the enumerated 15+ population**, tabulated across all 64 districts (Admin 02). They are **not** modeled figures, small-area estimations, or sample survey estimates.

### Rectification of Prior Citations
- All references to hypothetical or anticipated survey rounds have been removed from the repository.
- Citations cite strictly verifiable attributes: HDX dataset identifier, spreadsheet filename, sheet tab name, and exact column headers.

---

## 2. Digital Axis: Pairwise Correlations & Methodological Assessment

### Empirical Pairwise Correlation Matrices ($N = 64$ Districts)

Computed on raw values from `bbs_census_2022_admin02.xlsx`:

#### Pearson Correlation Matrix ($r$)
| Indicator | Internet 15+ | Mobile 15+ | MFS Account | Gender Gap | Inverted Gender Gap | Female Internet |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Internet 15+** | 1.0000 | +0.7212 | **-0.1615** | -0.4634 | +0.4634 | +0.9890 |
| **Mobile 15+** | +0.7212 | 1.0000 | +0.3904 | -0.3187 | +0.3187 | +0.7291 |
| **MFS Account** | **-0.1615** | +0.3904 | 1.0000 | +0.2101 | -0.2101 | -0.1982 |
| **Gender Gap (M - F)** | -0.4634 | -0.3187 | +0.2101 | 1.0000 | -1.0000 | -0.5898 |
| **Inv. Gender Gap (100 - Gap)** | +0.4634 | +0.3187 | -0.2101 | -1.0000 | 1.0000 | +0.5898 |
| **Female Internet** | +0.9890 | +0.7291 | -0.1982 | -0.5898 | +0.5898 | 1.0000 |

#### Spearman Rank Correlation Matrix ($\rho$)
| Indicator | Internet 15+ | Mobile 15+ | MFS Account | Gender Gap | Inverted Gender Gap | Female Internet |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Internet 15+** | 1.0000 | +0.6654 | **-0.2827** | -0.3912 | +0.3911 | +0.9818 |
| **Mobile 15+** | +0.6654 | 1.0000 | +0.2492 | -0.3747 | +0.3746 | +0.6865 |
| **MFS Account** | **-0.2827** | +0.2492 | 1.0000 | +0.1717 | -0.1719 | -0.3081 |
| **Gender Gap (M - F)** | -0.3912 | -0.3747 | +0.1717 | 1.0000 | -1.0000 | -0.5054 |
| **Inv. Gender Gap (100 - Gap)** | +0.3911 | +0.3746 | -0.1719 | -1.0000 | 1.0000 | +0.5054 |
| **Female Internet** | +0.9818 | +0.6865 | -0.3081 | -0.5054 | +0.5054 | 1.0000 |

### Descriptive Findings & Analytic Hypotheses:

1. **Device Access vs. Network Connectivity ($r = +0.7212$):**
   Mobile phone ownership has a high nationwide baseline across all districts (mean 67.96%, standard deviation 4.82%, ranging from 57.03% to 84.69%), whereas internet usage varies sharply across districts (mean 32.82%, standard deviation 9.44%, ranging from 18.45% in Panchagarh to 60.97% in Dhaka).

2. **Mobile Banking (MFS) is Uncorrelated with Internet Usage ($r = -0.1615$, $\rho = -0.2827$):**
   In this census dataset, MFS account ownership among adults 15+ (mean 38.53%, range 26.43% to 51.35%) does not positively track internet penetration.
   - *Descriptive Pattern:* Several low-internet rural districts show high MFS adoption (e.g., Kurigram has 45.45% MFS vs. 19.05% internet; Gaibandha has 46.97% MFS vs. 22.01% internet), while some districts with higher internet access show lower MFS adoption (e.g., Sunamganj has 26.43% MFS).
   - *Hypothesized Mechanisms (Untested):* In Bangladesh, mobile financial services operate primarily via 2G GSM USSD strings (`*247#`) and SMS on basic feature phones, and remittance-receiving corridors may rely heavily on mobile wallets rather than bank branches. These causal hypotheses are not formally tested in this cross-sectional census table.
   - *Denominator Note:* Confirmed from codebook: the MFS indicator measures percentage of the population aged 15 years and older holding an account.

3. **Gender Divide: Decision & Resolution:**
   - *The Problem:* The raw gender gap varies from 10.74 to 25.43 percentage points. Using arithmetic inversion (`100 - Gap`) gives credit to districts where both male and female access are low. Female internet rate correlates $r = +0.9890$ with Total Internet, and the Gender Parity Ratio correlates $r = +0.9228$.
   - *Final Decision:* The gender term was dropped from the composite Digital Access Score entirely to eliminate redundancy. Total internet rate is retained as the connectivity measure, while Female Usage, Male Usage, and the Gender Gap are reported as unweighted contextual statistics on each district dossier.

4. **Digital Axis Internal Collinearity Disclosure:**
   - *Correlation:* Internet Usage and Mobile Phone ownership correlate $r = +0.7212$ (Spearman $\rho = 0.6654$).
   - *Methodological Disclosure:* Documented explicitly as not fully independent orthogonal measures; instead, they capture shared variance between device possession and active digital connectivity.

---

## 3. Physical Service Axis: Data Sources, Coverage & Known Limitations

### Operational State:
Both Digital and Service axes have been **fully recomputed from verified primary sources**: BBS Census 2022 Admin 02 and HeiGIT HDX accessibility models. All 64 district scores, sensitivity matrices, and cluster archetypes reflect empirical measurements.

### Verified Datasets in Production Pipeline:
1. **National Grid Electricity Access:**
   - *Source File:* `etl/verified_raw/bbs_census_2022_admin02.xlsx`
   - *Sheet Name:* `' Main Source of Electricity '`
   - *Column Header:* `'National Grid_%'`
   - *Definition:* Percentage of households connected to the national electrical grid. Complete 64-district census enumeration (0 nulls).

2. **HeiGIT Population Accessibility Models (UN OCHA HDX):**
   - *HDX Dataset:* "Bangladesh - Accessibility Indicators" (HeiGIT / Heidelberg University, `https://data.humdata.org/dataset/hot-access-bgd`)
   - *Source Files:* `heigit_hospitals_access_wide.csv` & `heigit_education_access_wide.csv`
   - *Metrics:* Share of district population within 30 minutes of a hospital (`range = 1800`), and within 5km of an educational facility (`range = 5000`).
   - *Methodological Disclosure:* These indicators are openrouteservice travel-time models computed over OpenStreetMap (OSM) infrastructure layers and WorldPop population distribution rasters, rather than direct administrative line-ministry censuses.
   - *Advantage:* Standardized cross-sectional coverage across all 64 districts based on friction surfaces and population rasters.

3. **Public Health & Education Facilities (LGED GIS Spatial Records):**
   - *Source Files:* `bgd_poi_healthfacilities_lged.dbf` (2,484 facilities) & `bgd_poi_educationfacilities_lged.shp` (78,129 points).
   - *Spatial Join Results:* 77,962 points (99.79%) matched cleanly within official district polygons; 167 shoreline/estuary points (0.21%) were verified.
   - *Critical Audit Finding:* Spatial join revealed extreme surveyor sampling density skew in LGED's raw points (e.g. Mymensingh has 4,581 mapped schools vs. Panchagarh with only 6 mapped schools, reflecting uneven administrative mapping coverage).
   - *Pipeline Treatment:* To prevent penalizing districts purely due to administrative survey omission, standardized HeiGIT travel-time accessibility is used for the composite Service Access Score, while raw LGED facility counts are reported as secondary administrative records.

---

## 4. Candid Communication & Interview Narrative

When asked about the project history, earlier CV phrasing, or prototype status, use this direct statement:

> **Straight Interview Response:**  
> *"The original pipeline prototype was built on modeled placeholder data. My initial CV description overstated it by implying official data was already connected. I identified the discrepancy, corrected the CV, and updated the documentation to be transparent about what was prototype data and what was verified."*

**Communication Directives:**
- Do not use softened formulations ("modeled based on anticipated survey parameters", "immediately restructured").
- State plainly: the data was placeholder, the CV overstated it, and it was corrected.

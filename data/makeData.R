library(tidyverse)
library(readxl)

name_mapping <- read_excel("Indicator_name_mapping.xlsx", sheet = "mapping")
labels <- read_excel("source/DC equity text spreadsheet.xlsx")

data_sheets <- excel_sheets("source/Updated data for equity feature_10.17.xlsx")

city_dat <- read_excel("source/Updated data for equity feature_10.17.xlsx", sheet = data_sheets[1])
ward_dat <- read_excel("source/Updated data for equity feature_10.17.xlsx", sheet = data_sheets[2])
cluster_dat <- read_excel("source/Updated data for equity feature_10.17.xlsx", sheet = data_sheets[3])


# clean cluster names by getting rid of "Cluster X" and the parentheses from each name
# also filter out clusters 42, 45 and 46 which have small sample sizes
cluster_dat_clean <- cluster_dat %>%
  filter(!(geo %in% c("Cluster 42 (Observatory Circle)", "Cluster 45 (National Mall, Potomac River)", "Cluster 46 (Arboretum, Anacostia River)"))) %>%
  filter(equityvariable != "-") %>%
  mutate(geo2 = str_extract(geo, "\\(.*\\)")) %>%
  mutate(geo3 = str_sub(geo2, 2, -2)) %>%
  mutate(numerator = as.numeric(numerator)) %>%
  mutate(denom = as.numeric(denom)) %>%
  mutate(equityvariable = as.numeric(equityvariable)) %>%
  select(indicator, year, "geo" = geo3, numerator, denom, equityvariable)

dat <- bind_rows(city_dat, ward_dat, cluster_dat_clean) %>%
  select(-year) %>%
  mutate(geo = replace(geo, geo=="Washington, D.C.", "DC")) %>%
  filter(indicator != "Total Population") %>%
  left_join(name_mapping, by = c("indicator" = "data_name")) %>%
  left_join(labels, by=c("text_name" = "Full name of indicator")) %>%
  mutate(summary_sentence = str_c(`Summary sentence-pt 1`, geo, `Summary sentence-pt 2`, sep=" "))  %>%
  mutate(value = case_when(
    indicator %in% c("Small business lending per employee", "Age-adjusted premature mortality rate", "Violent Crime Rate per 1000 people") ~ round(equityvariable, digits = 0),
    indicator == "unemployment" ~ round(equityvariable, digits = 3),
    TRUE ~ round(equityvariable, digits = 2)
  )) %>%
  select(indicator_full_name = text_name, indicator = `Abberviated name of indicator`,
         year = `Year`, geo, numerator, denom, value,
         blue_bar_label = `Blue bar label`, diff_bar_label = `Yellow/pink bar label`,
         grey_bar_label = `Gray bar label`, summary_sentence)

# add a row with [fake] data to initialize the bar chart with
dat <- add_row(dat, indicator_full_name = "Initial",
                    indicator = "Initial",
                    year = "",
                    geo = "Initial",
                    numerator = "",
                    denom = "",
                    value = 0,
                    blue_bar_label = "",
                    diff_bar_label = "",
                    grey_bar_label = "",
                    summary_sentence = NA)

write_csv(dat, "equity_data.csv")
# NOTE: manually edit this CSV to remove the extra space in front of the period for 
# the small business lending summary sentence



##### Racial demo data ##############
race_data_sheets <- excel_sheets("source/Equity feature_racial composition.xlsx")

race_city_dat <- read_excel("source/Equity feature_racial composition.xlsx", sheet = race_data_sheets[1])
race_ward_dat <- read_excel("source/Equity feature_racial composition.xlsx", sheet = race_data_sheets[2])
race_cluster_dat <- read_excel("source/Equity feature_racial composition.xlsx", sheet = race_data_sheets[3])

race_cluster_dat_clean <- race_cluster_dat %>%
  filter(!(geo %in% c("Cluster 42 (Observatory Circle)", "Cluster 45 (National Mall, Potomac River)", "Cluster 46 (Arboretum, Anacostia River)"))) %>%
  mutate(geo2 = str_extract(geo, "\\(.*\\)")) %>%
  mutate(geo3 = str_sub(geo2, 2, -2)) %>%
  select(indicator, year, "geo" = geo3, numerator, denom, equityvariable)

race_dat <- bind_rows(race_city_dat, race_ward_dat, race_cluster_dat_clean) %>%
  mutate(geo = replace(geo, geo=="Washington, D.C.", "DC")) %>%
  mutate(race = case_when(
    indicator == "percent white" ~ "White",
    indicator == "percent black" ~ "Black",
    indicator == "percent latino" ~ "Latino",
    indicator == "percent Asian and Pacific Islander" ~ "Asian and Pacific Islander",
    indicator == "percent other or multiple race" ~ "Other or multiple race"
  )) %>%
  select(race, geo, n = numerator, total_population = denom, pct_population = equityvariable)
  
write_csv(race_dat, "racial_demo_data.csv")

library(tidyverse)
library(readxl)

name_mapping <- read_excel("Indicator_name_mapping.xlsx", sheet = "mapping")
labels <- read_excel("source/DC equity text spreadsheet.xlsx")

data_sheets <- excel_sheets("source/Updated data for equity feature_10.12.xlsx")

city_dat <- read_excel("source/Updated data for equity feature_10.12.xlsx", sheet = data_sheets[1])
ward_dat <- read_excel("source/Updated data for equity feature_10.12.xlsx", sheet = data_sheets[2])
cluster_dat <- read_excel("source/Updated data for equity feature_10.12.xlsx", sheet = data_sheets[3])

# clean cluster names by getting rid of "Cluster X" and the parentheses from each name
# also filter out clusters 42, 45 and 46 which have small sample sizes
cluster_dat_clean <- cluster_dat %>%
  filter(!(geo %in% c("Cluster 42 (Observatory Circle)", "Cluster 45 (National Mall, Potomac River)", "Cluster 46 (Arboretum, Anacostia River)"))) %>%
  mutate(geo2 = str_extract(geo, "\\(.*\\)")) %>%
  mutate(geo3 = str_sub(geo2, 2, -2)) %>%
  select(indicator, year, "geo" = geo3, numerator, denom, equityvariable)

dat <- bind_rows(city_dat, ward_dat, cluster_dat_clean) %>%
  select(-year) %>%
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

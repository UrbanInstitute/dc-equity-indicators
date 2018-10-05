library(tidyverse)
library(readxl)

name_mapping <- read_excel("Indicator_name_mapping.xlsx", sheet = "mapping")
labels <- read_excel("source/DC equity text spreadsheet.xlsx")

data_sheets <- excel_sheets("source/Updated data for equity feature_10.5.xlsx")

city_dat <- read_excel("source/Updated data for equity feature_10.5.xlsx", sheet = data_sheets[1])
ward_dat <- read_excel("source/Updated data for equity feature_10.5.xlsx", sheet = data_sheets[2])
cluster_dat <- read_excel("source/Updated data for equity feature_10.5.xlsx", sheet = data_sheets[3])

# clean cluster names by getting rid of "Cluster X" from each name
cluster_dat <- cluster_dat %>%
  mutate(geo2 = str_split(geo, "\\(")[[1]][2]) %>%
  mutate(geo3 = str_sub(geo2, end = -2)) %>%
  select(indicator, year, "geo" = geo3, numerator, denom, equityvariable)

dat <- bind_rows(city_dat, ward_dat, cluster_dat) %>%
  select(-year) %>%
  left_join(name_mapping, by = c("indicator" = "data_name")) %>%
  left_join(labels, by=c("text_name" = "Full Indicator label")) %>%
  select(indicator = text_name, indicator_short = `Abberviated label for menu`,
         year = `Year`, geo, numerator, denom, value = equityvariable,
         blue_bar_label = `Blue bar label`, diff_bar_label = `Yellow/pink bar label`,
         grey_bar_label = `Gray bar label`, summary_sentence = `Summary sentence`) %>%
  filter(!(geo %in% c("Cluster 42 (Observatory Circle)", "Cluster 45 (National Mall, Potomac River)", "Cluster 46 (Arboretum, Anacostia River)")))

# add a row with data to initialize the bar chart with
dat <- add_row(dat, indicator = "Initial",
                    indicator_short = "Initial",
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

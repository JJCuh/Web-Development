#include <stdio.h>
#include <float.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

char* FILE_NAME = "./hate-crimes.csv";
int MAX_LINE_LEN = 100;

int ROW_COUNT = 51;
char* ROW_PATTERN="%s,%d,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f";

/**
    Mistakes I made while writing: 

    1. -> for structs
    2. Check the max line len
    3. Make sure we have doubles instead of floats
    4. %s doesn't respect spaces, so replace spaces with underlines
    5. Fill 0 values in the data
    6. Various missing semicolons
    7. tried to separate things into files but forgot how to make it
    8. Tried to qsort but ran into junk with pointers
    9. Tokenization was a ...hassle

*/ 

struct Row {
    char *state; 
    int median_income;
    float unemployed_seasonal_percent;
    float metro_dwellers_percent;
    float high_school_grad_percent;
    float non_citizen_percent;
    float poor_white_percent;
    float gini_index;
    float non_white_percent;
    float trump_voter_percent;
    // number per 100k, use double so we can capture full decimal place
    double crimes_splc;
    double crimes_fbi;
};

void sort_names(struct Row* array[], int count) {
    bool flag;
    int i, j;
    struct Row* t;
    for (i = 1 ; i <= count - 1; i++) {
        t = array[i];

        for (j = i - 1 ; j >= 0; j--) {
            if (strcmp(array[j]->state, t->state) < 0) {
                break;  
            }

            array[j+1] = array[j];
            flag = 1;
        }

        if (flag) {
            array[j+1] = t;
        }
    }
}

void sort_income(struct Row* array[], int count) {
    bool flag;
    int i, j;
    struct Row* t;
    for (i = 1 ; i <= count - 1; i++) {
        t = array[i];

        for (j = i - 1 ; j >= 0; j--) {
            if (array[j]->median_income > t->median_income) {
                break;  
            }

            array[j+1] = array[j];
            flag = 1;
        }

        if (flag) {
            array[j+1] = t;
        }
    }
}

void read_data(struct Row* rows[]) {
    int i = 0;
    FILE *fp;

    fp = fopen(FILE_NAME, "r");
    if(fp == NULL) {
        printf("Error opening file\n");
        exit(1);
    }

    // skip through the heading line
    while (fgetc(fp) != '\n') {
        continue;
    }

    const char delimeter[2] = ",";
    char *token = malloc(sizeof(char) * MAX_LINE_LEN);
    char buffer[MAX_LINE_LEN];
    for (i = 0; i < ROW_COUNT; i++) {
        struct Row* row = rows[i];
        row->state = malloc(sizeof(char) * 20);
        fgets(buffer, MAX_LINE_LEN, fp);

        token = strtok(buffer, delimeter); 
        strcpy(row->state, token);

        token = strtok(NULL, delimeter);
        row->median_income = atoi(token); 

        token = strtok(NULL, delimeter);
        row->unemployed_seasonal_percent = atof(token);

        token = strtok(NULL, delimeter);
        row->metro_dwellers_percent = atof(token);

        token = strtok(NULL, delimeter);
        row->high_school_grad_percent = atof(token);

        token = strtok(NULL, delimeter);
        row->non_citizen_percent = atof(token);

        token = strtok(NULL, delimeter);
        row->poor_white_percent = atof(token);

        token = strtok(NULL, delimeter);
        row->gini_index = atof(token);

        token = strtok(NULL, delimeter);
        row->non_white_percent = atof(token);

        token = strtok(NULL, delimeter);
        row->trump_voter_percent = atof(token);

        token = strtok(NULL, delimeter);
        row->crimes_splc = atof(token);

        token = strtok(NULL, delimeter);
        row->crimes_fbi = atof(token);
    }
}

void print_usage(char *name) {
    printf("\nUSAGE\n---\n");
    printf("%s <compare_field>\n", name);
    printf("\t compare_field - name | median_income");
}

int main(int argc, char** argv) {
    struct Row* rows[ROW_COUNT];
    int i = 0;

    if (argc < 2) {
        printf("No argument provided for sorting.\n");
        print_usage(argv[0]);
        exit(2);
    }

    for (i = 0; i < ROW_COUNT; i++){
        rows[i] = (struct Row *) malloc(sizeof(struct Row));
    }

   read_data(rows);

    if (strcmp(argv[1], "name") == 0) {
        sort_names(rows, ROW_COUNT);
    } else if(strcmp(argv[1], "median_income") == 0) {
        sort_income(rows, ROW_COUNT);
    } else {
        printf("Unknown option for compare_field: %s\n", argv[1]);
        print_usage(argv[0]);
    }

    printf("%-20s\t INCOME\t SPLC\t FBI\n", "STATE");
    printf("---------------------------------------------\n");
    for (i = 0; i < ROW_COUNT; i++) {
        printf("%-20s\t %6d\t %.2f\t%4.2f\n", 
            rows[i]->state,
            rows[i]->median_income, 
            rows[i]->crimes_splc, 
            rows[i]->crimes_fbi
        );
    }
}
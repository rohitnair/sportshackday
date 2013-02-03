import sys

if __name__ == "__main__":
    team_code = sys.argv[1]
    file_name = open(sys.argv[2])

    for l in file_name:
        if team_code in l:
            l = l.strip()
            print l

    file_name.close()

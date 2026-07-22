import re

log_pattern = re.compile(r"^(?=[^\[]*\[([^\]]+)\])(?=.*\"[^\"]*\"\s+(\d{3})\s)(.*)$")


# # testing only
# log = '91.198.109.162 - - [Jul 23 2026, 09:48:45] "PUT /contact HTTP/1.1" 403 5530 "https://www.example.com" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"'

# res = log_pattern.match(log)

# if (res):
#     print(res.group(0))
#     print(res.group(1))
#     print(res.group(2))
#     print(res.group(3))
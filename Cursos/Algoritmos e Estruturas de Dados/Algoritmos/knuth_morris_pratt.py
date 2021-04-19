def KMP(pat,txt):
    M = len(pat)
    N = len(txt)
    lps = [0]*M
    j = 0 
    compute_lps_array(pat, M, lps)
  
    i = 0 
    while i < N:
        if pat[j] == txt[i]:
            i += 1
            j += 1
        if j == M:
            print(f"Encontrado padrão no índice {str(i-j)}")
            j = lps[j-1]
        elif i < N and pat[j] != txt[i]:
            if j != 0:
                j = lps[j-1]
            else:
                i += 1
  
def compute_lps_array(pat, M, lps):
    len = 0 
    lps[0] 
    i = 1
  
    while i < M:
        if pat[i]== pat[len]:
            len += 1
            lps[i] = len
            i += 1
        else:
            if len != 0:
                len = lps[len-1]
            else:
                lps[i] = 0
                i += 1
  
t1 = "ABABDABACDABABCABAB"
p1 = "ABABCABAB"
KMP(p1,t1)
t2 = "AAAAA"
p2 = "AA"
KMP(p2,t2)
t3 = "ABBBCAABCC"
p3 = "AB"
KMP(p3,t3)
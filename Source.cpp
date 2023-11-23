#include <iostream>
#include <cstdio>
#include <cstdlib>

int main() {
    int exitCode = system("node automation.js");

    if (exitCode == 0) {
        std::cout << "JavaScript automation script executed successfully." << std::endl;
    }
    else {
        std::cout << "Failed to execute the JavaScript automation script." << std::endl;
    }


    return 0;
}

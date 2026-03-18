#include <iostream>
#include "joule_thompson.hpp"
// #include "./Simulations/include/joule_thompson.hpp"

using namespace std;

int main() {
    double P1, P2, T, dt, totalTime;
    cout << "Enter inlet pressure (Pa): ";
    cin >> P1;
    cout << "Enter outlet pressure (Pa): ";
    cin >> P2;
    cout << "Enter initial temperature (K): ";
    cin >> T;
    cout << "Enter time step (s): ";
    cin >> dt;
    cout << "Enter total simulation time (s): ";
    cin >> totalTime;

    JouleThomsonSimulation JTE(P1, P2, T, dt, totalTime);

    cout << endl << "Running simulation..." << endl;
    JTE.run();
    JTE.displayFinal();
    return 0;
}
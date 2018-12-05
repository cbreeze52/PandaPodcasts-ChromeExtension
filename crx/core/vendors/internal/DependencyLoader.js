
/**
 * DependencyLoader
 * 
 * @abstract
 */
window.DependencyLoader = (function() {

    /**
     * Properties
     * 
     */

    /**
     * __attemptClosures
     * 
     * @access  private
     * @var     Array (default: [])
     */
    var __attemptClosures = [];

    /**
     * __attempts
     * 
     * @access  private
     * @var     Number (default: 0)
     */
    var __attempts = 0;

    /**
     * Methods
     * 
     */

    /**
     * __attempt
     * 
     * @access  private
     * @param   Array dependencies
     * @param   Function callback
     * @return  Boolean
     */
    var __attempt = function(dependencies, callback) {
        ++__attempts;
        __checkForFailure(dependencies);
        if (__dependenciesAvailable(dependencies) === true) {
            callback.apply(DependencyLoader);
            return true;
        }
        return false;
    };

    /**
     * __checkForFailure
     * 
     * @access  private
     * @param   Array dependencies
     * @return  void
     */
    var __checkForFailure = function(dependencies) {
        if (__attempts > 10000) {
            var msg = 'Could not complete an attempt: [';
            msg += dependencies.join(', ') + ']';
            throw new Error(msg);
        }
    };

    /**
     * __dependenciesAvailable
     * 
     * @access  private
     * @param   Array dependencies
     * @return  Boolean
     */
    var __dependenciesAvailable = function(dependencies) {
        var x = 0,
            l = dependencies.length;
        for (x; x < l; ++x) {
            if (window[dependencies[x]] === undefined) {
                return false;
            }
        }
        return true;
    };

    // Public
    return {

        /**
         * load
         * 
         * @access  public
         * @return  void
         */
        load: function() {
            var index = 0,
                attempt;
            while (__attemptClosures.length > 0) {
                attempt = __attemptClosures.shift();
                if (attempt.apply(DependencyLoader) === false) {
                    __attemptClosures.push(attempt);
                }
            }
        },

        /**
         * push
         * 
         * @access  public
         * @param   String|Array dependencies
         * @param   Function callback
         * @return  Boolean
         */
        push: function(dependencies, callback) {
            if (typeof dependencies === 'string') {
                dependencies = [dependencies];
            }
            var args = [dependencies, callback],
                attempt = function() {
                    var response = __attempt.apply(DependencyLoader, args);
                    return response;
                };
            __attemptClosures.push(attempt);
        }
    };
})();
